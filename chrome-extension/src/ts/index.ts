
import Constants from "./Constants";

class DialogHandler {
    private dialogElems = {
        "safe": document.querySelector("#dialog-safe"),
        "phishing": document.querySelector("#dialog-phishing"),
        "caution": document.querySelector("#dialog-caution"),
        "none": document.querySelector("#dialog-none"),
    };
    private urlTextElem = document.querySelector("#url-text");
    private static singleton: DialogHandler;

    private constructor() {}

    public static getDialogHandler(): DialogHandler {
        if (!DialogHandler.singleton) {
            DialogHandler.singleton = new DialogHandler()
        }
        return DialogHandler.singleton;
    }

    private getKeySet(obj: object, keyDelete: string): Set<string> {
        let keys = new Set(Object.keys(obj));
        keys.delete(keyDelete);
        return keys;
    }

    public setActiveUrl(url: string): void {
        this.urlTextElem.textContent = url;
    }

    public setActiveDialog(key: string): void {
        this.dialogElems[key].classList.remove("d-none");
        for (let k of this.getKeySet(this.dialogElems, key)) {
            this.dialogElems[k].classList.add("d-none");
        }
    }

    public setActiveDialogFromRes(res: boolean): void {
        this.setActiveUrl(res[Constants.KEY_LAST_DETECTION_URL]);
        switch (res[Constants.KEY_LAST_DETECTION_RESULT]) {
            case true:
                this.setActiveDialog("phishing");
                break;
            case false:
                this.setActiveDialog("safe");
                break;
            default:
                this.setActiveDialog("caution");
        }
    }
}

window.onload = () => {
    document.querySelector("#settings-btn").addEventListener("click", () => {
        chrome.runtime.openOptionsPage();
    });

    // Display the last detection
    chrome.storage.local.get(Constants.KEY_LAST_DETECTION, (items) => {
        console.log("load last detection");
        console.log(items);
        if (!items.hasOwnProperty(Constants.KEY_LAST_DETECTION)) {
            return;
        }
        let dialogHandler = DialogHandler.getDialogHandler();
        dialogHandler.setActiveDialogFromRes(items[Constants.KEY_LAST_DETECTION]);
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log(`msg: ${request}`);
        let dialogHandler = DialogHandler.getDialogHandler();
        dialogHandler.setActiveDialogFromRes(request.result);
    })
};
