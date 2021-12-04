
import Heuristics from "./heuristics";
import aDetection from "./aDetection";

type BasicAuthCheckResult = {
    basicAuth: {
        username: string,
        isDomain: boolean,
    } | boolean | null,
    dest: {
        hostname: string,
        isIp: boolean,
    } | null,
    error: string|null,
}

export default class URLBasicAuthDetection extends aDetection {

    private static instance: URLBasicAuthDetection;

    constructor() {
        super();
    }

    public static getInstance(): URLBasicAuthDetection {
        if (URLBasicAuthDetection.instance===undefined) {
            URLBasicAuthDetection.instance = new URLBasicAuthDetection();
        }
        return URLBasicAuthDetection.instance;
    }

    async detect(url: string): Promise<boolean> {
        return !!Heuristics.checkForBasicAuth(url)["basicAuth"];
    }

    public async detectAndGetResult(url: string): Promise<BasicAuthCheckResult> {
        return Heuristics.checkForBasicAuth(url);
    }
}
