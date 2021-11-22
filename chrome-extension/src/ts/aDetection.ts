
import Constants from "./Constants";

export default abstract class aDetection {

    private host: string = Constants.DEFAULT_API_URL;
    private path: string = Constants.DEFAULT_URLDETECTION_API;

    abstract async detect(val: any): Promise<boolean>;

    async sendRequest(url: string, headers?: Record<string, string>): Promise<JSON> {
        return fetch(
            this.host+this.path+btoa(url),
            {
                method: "GET",
                mode: "cors",
                headers: new Headers(headers),
            })
            .then((res) => {
                return res.json();
            })
    }

    public setHost(host: string) {
        this.host = host;
    }
    public setPath(path: string) {
        this.path = path;
    }
}
