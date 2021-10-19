
import Strings from "./Strings";
import URLDetection from "./URLDetection";

function updateBadgeFromDetection(res: boolean) {
    let badgeText: string;
    let badgeColor: string;
    switch (res) {
        case true:
            badgeText = Strings.BAD;
            badgeColor = "#FF0000";
            break;
        case false:
            badgeText = Strings.GOOD;
            badgeColor = "#00FF00";
            break;
        default:
            badgeText = Strings.CAUTION;
            badgeColor = "#FFAA00";
    }
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: badgeColor });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("Installed");
    chrome.storage.local.clear(() => {
        chrome.storage.local.set({
            [Strings.KEY_DEFAULT_API_URL]: "http://127.0.0.1:8000",
            [Strings.KEY_DEFAULT_URLDETECTION_API]: "/url",
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
        Strings.KEY_LAST_URL,
        Strings.KEY_DEFAULT_API_URL,
        Strings.KEY_DEFAULT_URLDETECTION_API
    ], async (items) => {
        let lastUrl = items[Strings.KEY_LAST_URL];
        let defaultApiUrl = items[Strings.KEY_DEFAULT_API_URL];
        let defaultUrlDetectionApi = items[Strings.KEY_DEFAULT_URLDETECTION_API];

        if (lastUrl == activeUrl) {
            console.log("repeat");
            return; // Prevent page's URL being sent several times
        }
        chrome.storage.local.set({ [Strings.KEY_LAST_URL]: activeUrl });

        let urlDetection = new URLDetection(defaultApiUrl, defaultUrlDetectionApi);
        chrome.action.setBadgeText({ text: "" });
        chrome.action.setBadgeBackgroundColor({ color: "#555555" });
        urlDetection.detectURL(activeUrl)
            .then((res) => {
                console.log(res);
                updateBadgeFromDetection(res);
                let resultObj = {
                    [Strings.KEY_LAST_DETECTION_RESULT]: res,
                    [Strings.KEY_LAST_DETECTION_URL]: activeUrl,
                };
                chrome.storage.local.set({ [Strings.KEY_LAST_DETECTION]: resultObj }, () => {
                    chrome.runtime.sendMessage({ result: resultObj });
                });
            })
            .catch((err) => {
                console.warn(err);
            });
    });
});
