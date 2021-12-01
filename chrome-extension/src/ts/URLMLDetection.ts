
import aDetection from "./aDetection";
import Constants from "./Constants";

export default class URLMLDetection extends aDetection {

    private static instance: URLMLDetection;

    private constructor() {
        super();
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
}
