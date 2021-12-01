
import Constants from "./Constants";
import URLBlackListDetection from "./URLBlackListDetection";
import URLMLDetection from "./URLMLDetection";
import { updateBadgeFromDetection } from "./updateBadgeFromDetection";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        [Constants.KEY_VT_ENABLED]: false,
        [Constants.KEY_VT_API_KEY]: undefined,
        [Constants.KEY_REDIRECT_ENABLED]: true,
        [Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED]: false,
        [Constants.KEY_REDIRECT_CUSTOM_URL]: undefined,
    }, () => {
        console.log("Installed and set default values");
    });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log(`tabs.onUpdated ${changeInfo.status}`);
    if (changeInfo.status != "loading") {
        return; // Only process initial url request
    }
    let activeURLObj = new URL(tab.url);
    // Only process http(s)
    if (activeURLObj.protocol != "http:" && activeURLObj.protocol != "https:") {
        console.log("not http, skipping");
        return;
    }
    // Get URL without the params
    let activeURL = `${activeURLObj.protocol}//${activeURLObj.host}${activeURLObj.pathname}`;

    const syncItems = await chrome.storage.sync.get([
        Constants.KEY_REDIRECT_ENABLED,
        Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED,
        Constants.KEY_REDIRECT_CUSTOM_URL,
    ]);

    chrome.storage.local.get([
        Constants.KEY_LAST_DETECTION,
    ], async (items) => {

        // Prevent page's URL being sent several times by saving last sent URL
        let lastUrl = items[Constants.KEY_LAST_DETECTION][Constants.KEY_LAST_DETECTION_URL];
        if (lastUrl == activeURL) {
            console.log(`URL repeat (${activeURL}), skipping...`);
            if (items[Constants.KEY_LAST_DETECTION][Constants.KEY_LAST_DETECTION_RESULT].isPhishing) {
                chrome.tabs.update({
                    url: syncItems[Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED] ?
                            syncItems[Constants.KEY_REDIRECT_CUSTOM_URL] :
                            chrome.runtime.getURL("phishing.html"),
                });
            }
            return;
        }

        let urlBlacklistDetection = URLBlackListDetection.getInstance();
        let urlMLDetection = URLMLDetection.getInstance();
        chrome.action.setBadgeText({ text: "" });
        chrome.action.setBadgeBackgroundColor({ color: "#555555" });
        var resultObj: object|string;
        try {
            let res: boolean = await urlBlacklistDetection.detect(activeURL);
            var source = "blacklist";
            // If blacklist didn't find phishing, call ml model
            if (!res) {
                res = await urlMLDetection.detect(activeURL);
                source = "ml";
            }

            // Redirect if found phishing
            console.log(syncItems[Constants.KEY_REDIRECT_ENABLED]);
            if (syncItems[Constants.KEY_REDIRECT_ENABLED] && res) {
                console.log("Redirecting...");
                chrome.tabs.update({
                    url: syncItems[Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED] ?
                            syncItems[Constants.KEY_REDIRECT_CUSTOM_URL] :
                            chrome.runtime.getURL("phishing.html"),
                });
            }

            updateBadgeFromDetection(res);
            resultObj = {
                [Constants.KEY_LAST_DETECTION_RESULT]: {
                    isPhishing: res,
                    source: source,
                },
                [Constants.KEY_LAST_DETECTION_URL]: activeURL,
            };
        }
        catch(err) {
            console.error(err);
            updateBadgeFromDetection(null);
            resultObj = "error";
        }
        chrome.storage.local.set({ [Constants.KEY_LAST_DETECTION]: resultObj }, () => {
            console.log('sending msg...');
            chrome.runtime.sendMessage({
                result: resultObj,
                source: source,
            });
        });
    });
});
