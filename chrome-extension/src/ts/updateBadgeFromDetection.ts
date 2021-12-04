
import Constants from "./Constants";

export function updateBadgeFromDetection(res: boolean) {
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
