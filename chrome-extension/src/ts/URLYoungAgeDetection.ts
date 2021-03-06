
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
        let ret = await Heuristics.checkAge(url);
        console.log("ageCheck");
        console.log(ret);
        return !!ret["tooYoung"];
    }

    public async detectAndGetResult(url: string): Promise<AgeCheckResult> {
        return Heuristics.checkAge(url);
    }

    public getDescription() {
        return "Domain registered recently";
    }
}
