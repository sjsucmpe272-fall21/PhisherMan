
import Heuristics from "./heuristics";
import aDetection from "./aDetection";
import Constants from "./Constants";

type AgeCheckResult = {
    age: {
        milliseconds: number,
        days: number,
    } | null,
    tooYoung: boolean|null,
    error: string|null,
}

export default class URLYoungAgeDetection extends aDetection {

    private static instance: URLYoungAgeDetection;

    constructor() {
        super();
        this.setHost(Constants.DEFAULT_API_URL);
        this.setPath(Constants.DEFAULT_URLBLACKLIST_API);
    }

    public static getInstance(): URLYoungAgeDetection {
        if (URLYoungAgeDetection.instance===undefined) {
            URLYoungAgeDetection.instance = new URLYoungAgeDetection();
        }
        return URLYoungAgeDetection.instance;
    }

    async detect(url: string): Promise<boolean> {
        return !!Heuristics.checkAge(url)["tooYoung"];
    }

    public async detectAndGetResult(url: string): Promise<AgeCheckResult> {
        return Heuristics.checkAge(url);
    }

}
