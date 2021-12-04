
import Heuristics from "./heuristics";
import aDetection from "./aDetection";
import Constants from "./Constants";

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
        this.setHost(Constants.DEFAULT_API_URL);
        this.setPath(Constants.DEFAULT_URLBLACKLIST_API);
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
