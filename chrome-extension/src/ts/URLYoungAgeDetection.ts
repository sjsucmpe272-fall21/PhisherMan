
import Heuristics from "./heuristics";
import aDetection from "./aDetection";

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
    }

    public static getInstance(): URLYoungAgeDetection {
        if (URLYoungAgeDetection.instance===undefined) {
            URLYoungAgeDetection.instance = new URLYoungAgeDetection();
        }
        return URLYoungAgeDetection.instance;
    }

    async detect(url: string): Promise<boolean> {
        let ret = !!Heuristics.checkAge(url)["tooYoung"];
        console.log(`ageCheck: ${ret}`);
        return ret;
    }

    public async detectAndGetResult(url: string): Promise<AgeCheckResult> {
        return Heuristics.checkAge(url);
    }

    public getDescription() {
        return "Domain registered recently";
    }
}
