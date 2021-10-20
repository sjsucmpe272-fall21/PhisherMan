
import aDetection from "./aDetection";

export default class URLDetection extends aDetection {

    constructor(host: string, path: string) {
        super(host, path);
    }

    async detect(url: string): Promise<boolean> {
        let res = await this.sendPost(
            { url: url }
        );
        return res["malicious"];
    }
}
