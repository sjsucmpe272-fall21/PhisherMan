
import Constants from "./Constants";
import URLBlackListDetection from "./URLBlackListDetection";
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
    console.log("tabs.onUpdated");
    console.log(changeInfo);
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

    chrome.storage.local.get([
        Constants.KEY_LAST_URL,
    ], async (items) => {

        // Prevent page's URL being sent several times by saving last sent URL
        let lastUrl = items[Constants.KEY_LAST_URL];
        if (lastUrl == activeURL) {
            console.log("URL repeat, skipping...");
            return;
        }
        chrome.storage.local.set({ [Constants.KEY_LAST_URL]: activeURL });

        let urlBlacklistDetection = URLBlackListDetection.getInstance();
        chrome.action.setBadgeText({ text: "" });
        chrome.action.setBadgeBackgroundColor({ color: "#555555" });
        var resultObj: object|string;
        try {
            let res = await urlBlacklistDetection.detect(activeURL);
            console.log(res);
            updateBadgeFromDetection(res);
            resultObj = {
                [Constants.KEY_LAST_DETECTION_RESULT]: res,
                [Constants.KEY_LAST_DETECTION_URL]: activeURL,
            };
        }
        catch(err) {
            console.error(err);
            updateBadgeFromDetection(null);
            resultObj = "error";
        }
        chrome.storage.local.set({ [Constants.KEY_LAST_DETECTION]: resultObj }, () => {
            console.log('sending msg...')
            chrome.runtime.sendMessage({
                result: resultObj,
                source: "blacklist",
            });
        });
    });
});
