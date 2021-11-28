
import Constants from "./Constants";

class OptionsForm {

    private constructor() {}

    public static getForm(): HTMLFormElement {
        return document.querySelector("#form-options");
    }
    public static getVTCheckbox(): HTMLInputElement {
        return document.querySelector("#check-vt");
    }
    public static getVTText(): HTMLInputElement {
        return document.querySelector("#text-vt");
    }
    public static getVTGroup(): HTMLDivElement {
        return document.querySelector("#text-vt-group");
    }
    public static getCustomRedirectGroup(): HTMLDivElement {
        return document.querySelector("#text-redirect-custom-group");
    }
    public static getRedirectCheckbox(): HTMLInputElement {
        return document.querySelector("#check-redirect");
    }
    public static getCustomRedirectURLCheckbox(): HTMLInputElement {
        return document.querySelector("#check-redirect-custom");
    }
    public static getCustomRedirectURLText(): HTMLInputElement {
        return document.querySelector("#text-redirect");
    }
    public static getSuccessMsg(): HTMLSpanElement {
        return document.querySelector("#success-msg");
    }
    public static getFailureMsg(): HTMLSpanElement {
        return document.querySelector("#failure-msg");
    }

    public static toggleElemDisplay(show: boolean, elem: HTMLElement): void {
        if (show) {
            elem.classList.remove("d-none");
        }
        else {
            elem.classList.add("d-none");
        }
    }

}

window.onload = () => {

    chrome.storage.sync.get([
        Constants.KEY_VT_ENABLED,
        Constants.KEY_VT_API_KEY,
        Constants.KEY_REDIRECT_ENABLED,
        Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED,
        Constants.KEY_REDIRECT_CUSTOM_URL,
    ], (res) => {
        OptionsForm.getVTCheckbox().checked = res[Constants.KEY_VT_ENABLED];
        OptionsForm.getRedirectCheckbox().checked = res[Constants.KEY_REDIRECT_ENABLED];
        OptionsForm.getCustomRedirectURLCheckbox().checked = res[Constants.KEY_REDIRECT_CUSTOM_URL_ENABLED];
        if (res[Constants.KEY_VT_API_KEY]) {
            OptionsForm.getVTText().value = res[Constants.KEY_VT_API_KEY];
        }
        if (res[Constants.KEY_REDIRECT_CUSTOM_URL]) {
            OptionsForm.getCustomRedirectURLText().value = res[Constants.KEY_REDIRECT_CUSTOM_URL];
        }

        OptionsForm.getCustomRedirectURLCheckbox().disabled = !OptionsForm.getRedirectCheckbox().checked;
        OptionsForm.toggleElemDisplay(
            OptionsForm.getRedirectCheckbox().checked && OptionsForm.getCustomRedirectURLCheckbox().checked,
            OptionsForm.getCustomRedirectGroup(),
        );
    });

    OptionsForm.getForm().addEventListener("submit", (e) => {
        e.preventDefault();

        var config = {
            vt: OptionsForm.getVTCheckbox().checked,
            redirect: OptionsForm.getRedirectCheckbox().checked,
        };

        if (config.vt) {
            config["vt_key"] = OptionsForm.getVTText().value;
        }
        if (config.redirect) {
            if (OptionsForm.getCustomRedirectURLCheckbox().checked) {
                config["custom_redirect"] = OptionsForm.getCustomRedirectURLText().value;
            }
        }

        OptionsForm.getSuccessMsg().classList.remove("d-none");
        setTimeout(() => {
            OptionsForm.getSuccessMsg().classList.add("d-none");
        }, 3000);
        console.log(config);
    });

    OptionsForm.getVTCheckbox().addEventListener("click", () => {
        OptionsForm.toggleElemDisplay(
            OptionsForm.getVTCheckbox().checked,
            OptionsForm.getVTGroup(),
        );
    });

    OptionsForm.getRedirectCheckbox().addEventListener("click", () => {
        OptionsForm.getCustomRedirectURLCheckbox().disabled = !OptionsForm.getRedirectCheckbox().checked;

        OptionsForm.toggleElemDisplay(
            OptionsForm.getRedirectCheckbox().checked && OptionsForm.getCustomRedirectURLCheckbox().checked,
            OptionsForm.getCustomRedirectGroup(),
        );
    });
    OptionsForm.getCustomRedirectURLCheckbox().addEventListener("click", () => {
        OptionsForm.toggleElemDisplay(
            OptionsForm.getCustomRedirectURLCheckbox().checked,
            OptionsForm.getCustomRedirectGroup(),
        );
    });
};
