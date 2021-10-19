
import Strings from "./Strings";

class DialogHandler {
    dialogs = {
        "safe": document.querySelector("#dialog-safe"),
        "phishing": document.querySelector("#dialog-phishing"),
        "caution": document.querySelector("#dialog-caution"),
        "none": document.querySelector("#dialog-none"),
    };
    urlText = document.querySelector("#url-text");

    private getKeySet(obj: object, keyDelete: string): Set<string> {
        let keys = new Set(Object.keys(obj));
        keys.delete(keyDelete);
        console.log(keys);
        return keys;
    }

    public setActiveUrl(url: string): void {
        this.urlText.textContent = url;
    }

    public setActiveDialog(key: string): void {
        this.dialogs[key].classList.remove("d-none");
        for (let k of this.getKeySet(this.dialogs, key)) {
            this.dialogs[k].classList.add("d-none");
        }
    }

    public setActiveDialogFromRes(res: boolean): void {
        this.setActiveUrl(res[Strings.KEY_LAST_DETECTION_URL]);
        switch (res[Strings.KEY_LAST_DETECTION_RESULT]) {
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

    chrome.storage.local.get(Strings.KEY_LAST_DETECTION, (items) => {
        console.log("load last detection");
        console.log(items);
        if (!items.hasOwnProperty(Strings.KEY_LAST_DETECTION)) {
            return;
        }
        let dialogHandler = new DialogHandler();
        dialogHandler.setActiveDialogFromRes(items[Strings.KEY_LAST_DETECTION]);
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log(`msg: ${request}`);
        let dialogHandler = new DialogHandler();
        dialogHandler.setActiveDialogFromRes(request.result);
    })
};
