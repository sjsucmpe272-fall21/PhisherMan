
import Constants from "./Constants";
import URLDetection from "./URLDetection";

function updateBadgeFromDetection(res: boolean) {
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
    console.log("Installed");
    chrome.storage.local.clear(() => {
        chrome.storage.local.set({
            [Constants.KEY_DEFAULT_API_URL]: Constants.DEFAULT_API_URL,
            [Constants.KEY_DEFAULT_URLDETECTION_API]: Constants.DEFAULT_URLDETECTION_API,
        });
    });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log("tabs.onUpdated");
    console.log(changeInfo);
    if (changeInfo.status != "loading") {
        return; // Only process initial url request
    }
    let activeUrl = tab.url;

    chrome.storage.local.get([
        Constants.KEY_LAST_URL,
    ], async (items) => {

        // Prevent page's URL being sent several times by saving last sent URL
        let lastUrl = items[Constants.KEY_LAST_URL];
        if (lastUrl == activeUrl) {
            console.log("repeat");
            return;
        }
        chrome.storage.local.set({ [Constants.KEY_LAST_URL]: activeUrl });

        let urlDetection = URLDetection.getInstance();
        chrome.action.setBadgeText({ text: "" });
        chrome.action.setBadgeBackgroundColor({ color: "#555555" });
        urlDetection.detect(activeUrl)
            .then((res) => {
                console.log(res);
                updateBadgeFromDetection(res);
                let resultObj = {
                    [Constants.KEY_LAST_DETECTION_RESULT]: res,
                    [Constants.KEY_LAST_DETECTION_URL]: activeUrl,
                };
                chrome.storage.local.set({ [Constants.KEY_LAST_DETECTION]: resultObj }, () => {
                    chrome.runtime.sendMessage({ result: resultObj });
                });
            })
            .catch((err) => {
                console.error(err);
            });
    });
});
