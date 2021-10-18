
import URLDetection from "./URLDetection";

const KEY_LAST_URL = "LAST_URL";
const KEY_DEFAULT_API_URL = "DEFAULT_API_URL";
const KEY_DEFAULT_URLDETECTION_API = "DEFAULT_URLDETECTION_API";

chrome.runtime.onInstalled.addListener(() => {
    console.log("Installed");
    chrome.storage.local.set({
        [KEY_DEFAULT_API_URL]: "http://127.0.0.1:8000",
        [KEY_DEFAULT_URLDETECTION_API]: "/url",
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
        KEY_LAST_URL,
        KEY_DEFAULT_API_URL,
        KEY_DEFAULT_URLDETECTION_API
    ], async (items) => {
        let lastUrl = items[KEY_LAST_URL];
        let defaultApiUrl = items[KEY_DEFAULT_API_URL];
        let defaultUrlDetectionApi = items[KEY_DEFAULT_URLDETECTION_API];

        if (lastUrl == activeUrl) {
            console.log("repeat");
            return; // Prevent page's URL being sent several times
        }
        chrome.storage.local.set({ [KEY_LAST_URL]: activeUrl });

        let urlDetection = new URLDetection(defaultApiUrl, defaultUrlDetectionApi);
        chrome.action.setBadgeText({ text: "..." });
        chrome.action.setBadgeBackgroundColor({ color: "#555555" });
        urlDetection.detectURL(activeUrl).then((res) => {
            console.log(res);
            if (res) {
                console.log("bad: " + activeUrl);
                chrome.action.setBadgeText({ text: "BAD" });
                chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
            }
            else {
                console.log("good: " + activeUrl);
                chrome.action.setBadgeText({ text: "GOOD" });
                chrome.action.setBadgeBackgroundColor({ color: "#00FF00" });
            }
        });
    });
});
