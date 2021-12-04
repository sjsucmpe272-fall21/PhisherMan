
import aDetection from "./aDetection";
import Constants from "./Constants";

export default class URLBlackListDetection extends aDetection {

    private static instance: URLBlackListDetection;

    constructor() {
        super();
        this.setHost(Constants.DEFAULT_API_URL);
        this.setPath(Constants.DEFAULT_URLBLACKLIST_API);
    }

    public static getInstance(): URLBlackListDetection {
        if (URLBlackListDetection.instance===undefined) {
            URLBlackListDetection.instance = new URLBlackListDetection();
        }
        return URLBlackListDetection.instance;
    }

    async detect(url: string): Promise<boolean> {
        let res = await this.sendRequest(
            url,
            { ['X-Api-Key']: Constants.API_KEY },
        );
        return res["malicious"];
    }

    public async detectAndGetResult(url: string): Promise<any> {
        let res = await this.sendRequest(
            url,
            { ['X-Api-Key']: Constants.API_KEY },
        );
        return res;
    }

    public getDescription() {
        return "URL found in blacklist";
    }
}
