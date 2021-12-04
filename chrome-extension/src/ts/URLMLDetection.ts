
import aDetection from "./aDetection";
import Constants from "./Constants";

export default class URLMLDetection extends aDetection {

    private static instance: URLMLDetection;

    constructor() {
        super();
        this.setHost(Constants.DEFAULT_API_URL);
        this.setPath(Constants.DEFAULT_URLML_API);
    }

    public static getInstance(): URLMLDetection {
        if (URLMLDetection.instance===undefined) {
            URLMLDetection.instance = new URLMLDetection();
        }
        return URLMLDetection.instance;
    }

    private endsWithTLD(url: string) {
        console.log("testing tld for:" +url);
        return /\.[a-zA-Z]+$/.test(
            (new URL(url)).hostname
        );
    }

    async detect(url: string): Promise<boolean> {
        if (!this.endsWithTLD(url)) {
            console.log("Doesn't pass endsWithTLD() check. Skipping ML...");
            return false;
        }
        let res = await this.sendRequest(
            url,
            { ['X-Api-Key']: Constants.API_KEY },
        );
        return res["malicious"];
    }

    public async detectAndGetResult(url: string): Promise<any> {
        if (!this.endsWithTLD(url)) {
            console.log("Doesn't pass endsWithTLD() check. Skipping ML...");
            return null;
        }
        let res = await this.sendRequest(
            url,
            { ['X-Api-Key']: Constants.API_KEY },
        );
        return res;
    }

    public getDescription() {
        return "URL classified by AI";
    }
}
