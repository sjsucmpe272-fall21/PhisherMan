
import Constants from "./Constants";
import URLBlackListDetection from "./URLBlackListDetection";

export function updateBadgeFromDetection(res: boolean) {
    let badgeText: string;
    let badgeColor: string;
    switch (res) {
        case true:
            badgeText = Constants.BAD;
            badgeColor = "#FF0000";
            break;
        case false:
            badgeText = Constants.GOOD;
            badgeColor = "#00FF00";
            break;
        default:
            badgeText = Constants.CAUTION;
            badgeColor = "#FFAA00";
    }
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: badgeColor });
}

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
        urlBlacklistDetection.detect(activeURL)
            .then((res) => {
                console.log(res);
                updateBadgeFromDetection(res);
                let resultObj = {
                    [Constants.KEY_LAST_DETECTION_RESULT]: res,
                    [Constants.KEY_LAST_DETECTION_URL]: activeURL,
                };
                chrome.storage.local.set({ [Constants.KEY_LAST_DETECTION]: resultObj }, () => {
                    chrome.runtime.sendMessage({ result: resultObj });
                });
            })
            .catch((err) => {
                console.error(err);
                updateBadgeFromDetection(null);
                chrome.runtime.sendMessage({ result: "error" });
            });
    });
});
