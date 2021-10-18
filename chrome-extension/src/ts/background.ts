
const KEY_LAST_URL = "LAST_URL";

chrome.runtime.onInstalled.addListener(() => {
    console.log("Installed");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("tabs.onUpdated");
    let activeUrl = tab.url;
    console.log(activeUrl);
    console.log(tab);

    chrome.storage.local.get(KEY_LAST_URL, (items) => {
        if (items[KEY_LAST_URL] == activeUrl) {
            return; // Prevent page's URL being sent several times
        }
        chrome.storage.local.set({ [KEY_LAST_URL]: activeUrl });
    });
});
