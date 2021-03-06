
import Constants from "./Constants";
import URLBlackListDetection from "./URLBlacklistDetection";
import URLMLDetection from "./URLMLDetection";
import URLYoungAgeDetection from "./URLYoungAgeDetection";
import URLBasicAuthDetection from "./URLBasicAuthDetection";
import StorageListener from "./StorageListener";
import { updateBadgeFromDetection } from "./updateBadgeFromDetection";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        [Constants.KEY_ML_ENABLED]: true,
        [Constants.KEY_BL_ENABLED]: true,
        [Constants.KEY_VT_ENABLED]: false,
        [Constants.KEY_VT_API_KEY]: undefined,
        [Constants.KEY_REDIRECT_ENABLED]: true,
        [Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED]: false,
        [Constants.KEY_REDIRECT_CUSTOM_URL]: undefined,
    }, () => {
        console.log("Installed and set default values");
        StorageListener.getInstance(); // initialize StorageListener
    });
});

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        console.log("beforeRequest");
        console.log(details);

        let activeURLObj = new URL(details.url);
        // Only process http(s)
        if (activeURLObj.protocol != "http:" && activeURLObj.protocol != "https:") {
            console.log("not http, skipping");
            return;
        }
        // Get URL without the params
        let activeURL = `${activeURLObj.protocol}//${activeURLObj.host}${activeURLObj.pathname}`;

        const storageListener = StorageListener.getInstance();
        const settingsValues = {
            [Constants.KEY_ML_ENABLED]: storageListener.getValue(Constants.KEY_ML_ENABLED),
            [Constants.KEY_BL_ENABLED]: storageListener.getValue(Constants.KEY_BL_ENABLED),
            [Constants.KEY_REDIRECT_ENABLED]: storageListener.getValue(Constants.KEY_REDIRECT_ENABLED),
            [Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED]: storageListener.getValue(Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED),
            [Constants.KEY_REDIRECT_CUSTOM_URL]: storageListener.getValue(Constants.KEY_REDIRECT_CUSTOM_URL),
        };

        chrome.storage.local.get([
            Constants.KEY_LAST_DETECTION,
        ], async (items) => {

            // Prevent page's URL being sent several times by saving last sent URL
            let lastUrl = items[Constants.KEY_LAST_DETECTION][Constants.KEY_LAST_DETECTION_URL];
            console.log(`${lastUrl} == ${activeURL}`);
            if (lastUrl == activeURL) {
                console.log(`URL repeat (${activeURL}), skipping...`);
                console.log(`REDIRECT_ENABLED: ${settingsValues[Constants.KEY_REDIRECT_ENABLED]}`);
                console.log(`LAST_DETECTION_RESULT: ${items[Constants.KEY_LAST_DETECTION][Constants.KEY_LAST_DETECTION_RESULT].isPhishing}`);
                if (settingsValues[Constants.KEY_REDIRECT_ENABLED] &&
                    items[Constants.KEY_LAST_DETECTION][Constants.KEY_LAST_DETECTION_RESULT].isPhishing) {
                    console.log("Redirecting...");
                    chrome.tabs.update(
                        details.tabId,
                        {
                            url: settingsValues[Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED] ?
                                    settingsValues[Constants.KEY_REDIRECT_CUSTOM_URL] :
                                    chrome.runtime.getURL("phishing.html"),
                        },
                        ()=>{}
                    );
                }
                return;
            }

            // Initialize detection methods
            const coreDetections = [
                {
                    method: URLBlackListDetection.getInstance(),
                    trimParams: true,
                    enabled: settingsValues[Constants.KEY_BL_ENABLED],
                },
                {
                    method: URLMLDetection.getInstance(),
                    trimParams: false,
                    enabled: settingsValues[Constants.KEY_ML_ENABLED],
                },
            ];
            const heuristicDetections = [
                URLYoungAgeDetection.getInstance(),
                URLBasicAuthDetection.getInstance(),
            ];

            chrome.action.setBadgeText({ text: "" });
            chrome.action.setBadgeBackgroundColor({ color: "#555555" });
            var retObj: object|string;
            try {
                var results: {description: string, result: boolean}[] = [];
                var isPhishing: boolean = false;
                var isSuspicious: boolean = false;

                // Core detections
                for (let detectionMethod of coreDetections) {
                    if (!detectionMethod.enabled) {
                        continue;
                    }
                    let res = await detectionMethod.method.detect(
                        detectionMethod.trimParams ? activeURL : details.url
                    );
                    isPhishing = isPhishing || res;
                    results.push({
                        description: detectionMethod.method.getDescription(),
                        result: res,
                    });
                }

                // Heuristic detections
                for (let detectionMethod of heuristicDetections) {
                    let res = await detectionMethod.detect(details.url);
                    isSuspicious = isSuspicious || res;
                    results.push({
                        description: detectionMethod.getDescription(),
                        result: res,
                    });
                }

                // Redirect if found phishing
                console.log(settingsValues[Constants.KEY_REDIRECT_ENABLED]);
                if (settingsValues[Constants.KEY_REDIRECT_ENABLED] && (isPhishing||isSuspicious)) {
                    console.log("Redirecting...");
                    chrome.tabs.update(
                        details.tabId,
                        {
                            url: settingsValues[Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED] ?
                                    settingsValues[Constants.KEY_REDIRECT_CUSTOM_URL] :
                                    chrome.runtime.getURL(isSuspicious ? "suspicious.html" : "phishing.html"),
                        },
                        ()=>{}
                    );
                }

                console.log(`storing ${activeURL}...`);
                updateBadgeFromDetection(isPhishing);
                retObj = {
                    [Constants.KEY_LAST_DETECTION_RESULT]: {
                        isPhishing: isPhishing,
                        isSuspicious: isSuspicious,
                        description: results,
                    },
                    [Constants.KEY_LAST_DETECTION_URL]: activeURL,
                };
            }
            catch(err) {
                console.error(err);
                updateBadgeFromDetection(null);
                retObj = "error";
            }
            chrome.storage.local.set({ [Constants.KEY_LAST_DETECTION]: retObj }, () => {
                console.log('sending msg...');
                chrome.runtime.sendMessage({
                    result: retObj,
                    description: results,
                });
            });
        });
    },
    {
        urls: ["<all_urls>"],
        types: [
            "main_frame",
            // "sub_frame" // Should be enabled to capture iframes, but causes too many requests for now + false positives
        ],
    },
    []
);
