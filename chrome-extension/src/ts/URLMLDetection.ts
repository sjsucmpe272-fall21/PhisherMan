
import aDetection from "./aDetection";
import Constants from "./Constants";

export default class URLMLDetection extends aDetection {

    private static instance: URLMLDetection;

    constructor() {
        super();
        this.setHost(Constants.DEFAULT_API_URL);
        this.setPath(Constants.DEFAULT_URLBLACKLIST_API);
    }

    public static getInstance(): URLMLDetection {
        if (URLMLDetection.instance===undefined) {
            URLMLDetection.instance = new URLMLDetection();
        }
        return URLMLDetection.instance;
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
}
