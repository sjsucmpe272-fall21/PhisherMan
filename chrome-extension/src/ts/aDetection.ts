
export default abstract class aDetection {

    private host: string;
    private path: string;

    constructor(host: string, path: string) {
        this.host = host;
        this.path = path;
    }

    async sendPost(args: Record<string, string>, headers?: Record<string, string>): Promise<JSON> {
        return fetch(
            this.host + this.path,
            {
                method: "POST",
                mode: "cors",
                headers: new Headers(headers),
                body: JSON.stringify(args),
            })
            .then((res) => {
                return res.json();
            })
    }
}
