
import Constants from "./Constants";

export default class StorageListener {

    private static instance: StorageListener;
    private static values: Record<string,boolean|string> = {
        [Constants.KEY_VT_ENABLED]: undefined,
        [Constants.KEY_VT_API_KEY]: undefined,
        [Constants.KEY_REDIRECT_ENABLED]: undefined,
        [Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED]: undefined,
        [Constants.KEY_REDIRECT_CUSTOM_URL]: undefined,
    };

    private constructor() {
        chrome.storage.sync.get([
            Constants.KEY_VT_ENABLED,
            Constants.KEY_VT_API_KEY,
            Constants.KEY_REDIRECT_ENABLED,
            Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED,
            Constants.KEY_REDIRECT_CUSTOM_URL,
        ], (items) => {
            for (let key of Object.keys(items)) {
                if (StorageListener.values.hasOwnProperty(key)) {
                    console.log(`Setting ${key}: ${items[key]}`);
                    StorageListener.values[key] = items[key];
                }
            }
        });
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName == "sync") {
                console.log(changes);
                for (let key of Object.keys(changes)) {
                    if (StorageListener.values.hasOwnProperty(key)) {
                        console.log(`Updating ${key}: ${changes[key].newValue}`);
                        StorageListener.values[key] = changes[key].newValue;
                    }
                }
            }
        });
    }

    public static getInstance(): StorageListener {
        if (StorageListener.instance === undefined) {
            StorageListener.instance = new StorageListener();
        }
        return StorageListener.instance;
    }

    public getValue(key: string): string|boolean {
        return StorageListener.values[key];
    }
}
