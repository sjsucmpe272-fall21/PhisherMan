
import aDetection from "./aDetection";

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
        let res = await this.sendPost(
            { url: url }
        );
        return res["malicious"];
    }
}
