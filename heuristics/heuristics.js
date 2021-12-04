
const ICANN_ENDPOINT = "https://rdap.verisign.com/com/v1/domain/";
const TOO_YOUNG_DAYS_THRESHOLD = 33;

// TODO: use public suffix list to check for domain names with multiple dots like "co.uk"
const getDomainFromURL = url => {
  const urlParts = new URL(url).hostname.split('.')
  return urlParts.slice(-2).join('.')
}

async function checkAge(url) {
    try {
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

function checkForIPObfuscation(url) {
    try {
        const url = new URL(url);

        return {
            obfuscated: true,
            error: null,
        }
    }
    catch (err) {
        console.error(err);
        return {
            obfuscated: null,
            error: err,
        }
    }
}

(async () => {
    let res = await checkAge("https://www.amercaneisxpzizss.com/");
    console.log(res.age.days);
    console.log(res.tooYoung);
})();
