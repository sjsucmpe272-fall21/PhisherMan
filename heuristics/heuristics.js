
const ICANN_ENDPOINT = "https://rdap.verisign.com/com/v1/domain/";
const TOO_YOUNG_DAYS_THRESHOLD = 33;

// https://github.com/sindresorhus/is-ip
// https://github.com/sindresorhus/ip-regex
const v4 = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';
const v6seg = '[a-fA-F\\d]{1,4}';
const v6 = `
(?:
(?:${v6seg}:){7}(?:${v6seg}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(?::${v6seg}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(?::${v6seg}){0,1}:${v4}|(?::${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(?::${v6seg}){0,2}:${v4}|(?::${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(?::${v6seg}){0,3}:${v4}|(?::${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(?::${v6seg}){0,4}:${v4}|(?::${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();
// Pre-compile only the exact regexes because adding a global flag make regexes stateful
const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
const ip = v46Exact;
const isIp = string => ip.test(string);

// TODO: use public suffix list to check for domain names with multiple dots like "co.uk"
const getDomainFromURL = (url) => {
    const urlParts = new URL(url).hostname.split('.')
    return urlParts.slice(-2).join('.')
}

async function checkAge(url) {
    try {
        if (isIP((new URL(url)).hostname)) {
            throw "Not a domain name";
        }
        var domain = getDomainFromURL(url);
        console.log(domain);
        const res = await fetch(
            ICANN_ENDPOINT+domain,
            {
                method: "GET",
                mode: "cors",
            }
        );

        if (res.status!=200) {
            throw `Got status code ${res.status}`;
        }

        const resJson = await res.json();

        for (let event of resJson["events"]) {
            if (event["eventAction"]=="registration") {
                let diff = (new Date()) - (new Date(event["eventDate"]));
                let diffDays = Math.round(diff/100/60/60/24);
                return {
                    age: {
                        milliseconds: diff,
                        days: diffDays,
                    },
                    tooYoung: diffDays < TOO_YOUNG_DAYS_THRESHOLD,
                    error: null,
                }
            }
        }

        throw "No registration found!";
    }
    catch (err) {
        console.error(err);
        return {
            age: null,
            tooYoung: null,
            error: err,
        }
    }
}

function checkForBasicAuth(url) {
    try {
        const urlObj = new URL(url);
        const username = decodeURI(urlObj.username);
        return {
            basicAuth: username ? {
                username: username,
                isDomain: /\.\w+$/.test(username),
            } : false,
            dest: {
                hostname: urlObj.hostname,
                isIp: isIp(urlObj.hostname),
            },
            error: null,
        }
    }
    catch (err) {
        console.error(err);
        return {
            basicAuth: null,
            dest: null,
            error: err,
        }
    }
}

// (async () => {
//     let res = await checkAge("https://www.amercaneisxpzizss.com/");
//     console.log(res.age.days);
//     console.log(res.tooYoung);
// })();

export default {
    checkAge: checkAge,
    checkForBasicAuth: checkForBasicAuth,
}
