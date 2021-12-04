
export default abstract class aDetection {

    private host: string;
    private path: string;

    abstract async detect(val: any): Promise<boolean>;
    abstract async detectAndGetResult(val: any): Promise<any>;

    async sendRequest(url: string, headers?: Record<string, string>): Promise<JSON> {

        if (this.host===undefined || this.path===undefined) {
            throw "No host/path";
        }

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
