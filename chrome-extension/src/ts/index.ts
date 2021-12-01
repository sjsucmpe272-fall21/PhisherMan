
import Constants from "./Constants";
import { updateBadgeFromDetection } from "./background";

class DialogHandler {
    private urlTextElem = document.querySelector("#url-text");
    private dialogsElem: HTMLDivElement = document.querySelector("#dialogs");
    private svgCheckHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>`;
    private svgExHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-fill-x" viewBox="0 0 16 16"><path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zM6.854 5.146 8 6.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 7l1.147 1.146a.5.5 0 0 1-.708.708L8 7.707 6.854 8.854a.5.5 0 1 1-.708-.708L7.293 7 6.146 5.854a.5.5 0 1 1 .708-.708z"/></svg>`;
    private svgCautionHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-exclamation" viewBox="0 0 16 16"><path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/><path d="M7.001 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0L7.1 4.995z"/></svg>`;
    // private svgQuestionHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/></svg>`;
    private spinnerHTML = `<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>`;
    private vtEnabled: boolean;
    private vtAPIKey: string;
    private static singleton: DialogHandler;

    public static ID_MAIN_DIALOG = "MAIN_DIALOG";
    public static ID_VT_DIALOG = "VT_DIALOG";

    private constructor() {
        this.createDialogElem(DialogHandler.ID_MAIN_DIALOG);

        const updateVTDialog = (btnStr?: string) => {
            let btnId = `${DialogHandler.ID_VT_DIALOG}-btn`;
            // Add VirusTotal button
            this.newDialog(
                undefined,
                DialogHandler.ID_VT_DIALOG,
                `<button id="${btnId}" class="btn btn-sm bg-transparent border-0">${btnStr?btnStr:"Run a VirusTotal scan?"}</button>`,
                "text-muted",
                "",
                () => {
                    let elem = document.getElementById(btnId);
                    elem.addEventListener("click", () => {
                        elem.innerHTML = `Run a VirusTotal scan ${this.spinnerHTML}`;
                        console.log(this.vtAPIKey);
                        console.log(this.getActiveUrl());

                        // Todo: move VirusTotal request to dedicated class
                        fetch(
                            "https://www.virustotal.com/api/v3/urls",
                            {
                                method: "POST",
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "x-apikey": this.vtAPIKey,
                                },
                                body: new URLSearchParams({url: this.getActiveUrl()}),
                                mode: "cors",
                            }
                        )
                        .then(res => res.json())
                        .then(async json => {
                            const getResults = async () => {
                                let res = await fetch(
                                    `https://www.virustotal.com/api/v3/analyses/${json["data"]["id"]}`,
                                    {
                                        method: "GET",
                                        headers: {
                                            "Accept": "application/json",
                                            "x-apikey": this.vtAPIKey,
                                        },
                                        mode: "cors",
                                    }
                                );
                                res = await res.json();

                                console.log(res);
                                if (res["data"]["attributes"]["status"]!="completed") {
                                    return false;
                                }

                                let resultsObj = res["data"]["attributes"]["results"];
                                let resultsObjKeys = Object.keys(resultsObj);
                                let phishingCount = 0;
                                let maliciousCount = 0;
                                let totCount = resultsObjKeys.length;
                                for (let key of resultsObjKeys) {
                                    let result = resultsObj[key]["result"];
                                    if (result=="phishing") {
                                        phishingCount++;
                                    }
                                    else if (result=="malicious"||result=="malware") {
                                        maliciousCount++;
                                    }
                                }
                                let msg: string;
                                if (phishingCount) {
                                    msg = "Phishing";
                                }
                                else if (maliciousCount) {
                                    msg = "Malicious";
                                }
                                else {
                                    msg = "No detections";
                                }
                                this.newDialog(
                                    phishingCount ? true : (maliciousCount ? undefined : false),
                                    DialogHandler.ID_VT_DIALOG,
                                    `${msg} (<a href="https://www.virustotal.com/gui/url/${res["meta"]["url_info"]["id"]}" target="_blank" rel="noreferrer">VT ${phishingCount+maliciousCount}/${totCount}</a>)`,
                                );
                                return true;
                            };
                            let tries = 0;
                            do {
                                if (++tries==5) {
                                    break;
                                }
                                console.log('Sleep');
                                // Wait 1.5 seconds before requesting results
                                await (new Promise(resolve => setTimeout(resolve, 1500)));
                                var success = await getResults();
                            } while(!success);
                            if (!success) {
                                updateVTDialog("Too many retries. Wait and try again");
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            updateVTDialog("Encountered an error");
                        });
                    });
                }
            );
        }

        chrome.storage.sync.get([
            Constants.KEY_VT_ENABLED,
            Constants.KEY_VT_API_KEY,
        ], (items) => {
            this.vtEnabled = items[Constants.KEY_VT_ENABLED];
            if (this.vtEnabled) {
                this.vtAPIKey = items[Constants.KEY_VT_API_KEY];
                updateVTDialog();
            }
        });
        chrome.storage.onChanged.addListener((changes, areaName) => {
            console.log(changes);
            console.log(areaName);
            if (areaName == "sync") {
                if (changes.hasOwnProperty(Constants.KEY_VT_ENABLED)) {
                    this.vtEnabled = changes[Constants.KEY_VT_ENABLED].newValue;
                    if (this.vtEnabled) {
                        updateVTDialog();
                    }
                    else {
                        this.removeDialog(DialogHandler.ID_VT_DIALOG);
                    }
                }
                if (changes.hasOwnProperty(Constants.KEY_VT_API_KEY)) {
                    this.vtAPIKey = changes[Constants.KEY_VT_API_KEY].newValue;
                }
            }
        })
    }

    public static getDialogHandler(): DialogHandler {
        if (!DialogHandler.singleton) {
            DialogHandler.singleton = new DialogHandler();
        }
        return DialogHandler.singleton;
    }

    public setActiveUrl(url: string): void {
        this.urlTextElem.textContent = url;
    }

    public getActiveUrl(): string {
        return this.urlTextElem.textContent;
    }

    public getMessageFromResult(res: boolean): string {
        switch(res) {
            case true:
                return "Phishing detected";
            case false:
                return "No phishing detected";
            default:
                return "Possible phishing site";
        }
    }

    public clearDialogs(): void {
        this.dialogsElem.innerHTML = "";
    }

    public removeDialog(id: string) {
        let elem = document.getElementById(id);
        elem && elem.remove();
    }

    private createDialogElem(id: string): HTMLElement {
        let newDialog = document.createElement("div");
        newDialog.id = id;
        this.dialogsElem.appendChild(newDialog);
        return document.getElementById(id);
    }

    public newDialog(
        classification: boolean,
        id: string,
        dialogMessage?: string,
        customClass?: string,
        customIcon?: string,
        callback?: ()=>void,
    ): void {
        let dialogElem = document.getElementById(id);
        if (!dialogElem) {
            dialogElem = this.createDialogElem(id);
        }
        dialogElem.innerHTML = "";
        dialogElem.className = "";
        if (dialogMessage === undefined) {
            dialogMessage = this.getMessageFromResult(classification);
        }
        let dialogClass: string;
        let dialogIcon: string;
        switch(classification) {
            case true:
                dialogClass = "text-danger";
                dialogIcon = this.svgExHTML;
                break;
            case false:
                dialogClass = "text-success";
                dialogIcon = this.svgCheckHTML;
                break;
            default:
                dialogClass = "text-warning";
                dialogIcon = this.svgCautionHTML;
        }
        if (customClass !== undefined) {
            dialogClass = customClass;
        }
        if (customIcon !== undefined) {
            dialogIcon = customIcon;
        }
        dialogElem.classList.add(dialogClass);
        dialogElem.innerHTML += dialogIcon + `<span> ${dialogMessage}</span>`;

        callback && callback();
    }
}

window.onload = () => {
    // Setup settings links
    document.querySelectorAll(".settings-btn").forEach(elem => {
        elem.addEventListener("click", () => {
            chrome.runtime.openOptionsPage();
        });
    });

    // Display the last detection on first load
    chrome.storage.local.get(Constants.KEY_LAST_DETECTION, (items) => {
        console.log("load last detection");
        console.log(items);
        if (!items.hasOwnProperty(Constants.KEY_LAST_DETECTION)) {
            return;
        }
        let dialogHandler = DialogHandler.getDialogHandler();
        dialogHandler.setActiveUrl(items[Constants.KEY_LAST_DETECTION][Constants.KEY_LAST_DETECTION_URL]);
        let lastResult = items[Constants.KEY_LAST_DETECTION][Constants.KEY_LAST_DETECTION_RESULT];
        dialogHandler.newDialog(
            lastResult,
            DialogHandler.ID_MAIN_DIALOG,
        );
        updateBadgeFromDetection(lastResult);
    });

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log(`msg: ${request}`);
        let dialogHandler = DialogHandler.getDialogHandler();
        let dialogMessage: string;
        switch(request.result) {
            case "error":
                dialogMessage = "Error processing URL"
                break;
            default:
                dialogMessage = dialogHandler.getMessageFromResult(request.result);
        }
        dialogHandler.setActiveUrl(request.result[Constants.KEY_LAST_DETECTION_URL]);
        dialogHandler.newDialog(
            request.result[Constants.KEY_LAST_DETECTION_RESULT],
            DialogHandler.ID_MAIN_DIALOG,
            dialogMessage,
        );
    });
};
