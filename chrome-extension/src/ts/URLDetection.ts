
import aDetection from "./aDetection";
import Constants from "./Constants";

export default class URLDetection extends aDetection {

    private static instance: URLDetection;

    private constructor() {
        super();
    }

    public static getInstance(): URLDetection {
        if (URLDetection.instance===undefined) {
            URLDetection.instance = new URLDetection();
        }
        return URLDetection.instance;
    }

    async detect(url: string): Promise<boolean> {
        let res = await this.sendRequest(
            url,
            { ['X-Api-Key']: Constants.API_KEY },
        );
        return res["malicious"];
    }
}
