import { knownPattern } from "./ruleList.js";

async function handleUrl(originalLink) {
    const originalURL = new URL(originalLink);
    const cleanLink = originalLink.toString().replace(/\?.*$/g, "");
    if (knownPattern.has(originalURL.hostname)) {
        const originParams = new URLSearchParams(originalURL.search);
        const replaceHost = knownPattern.get(originalURL.hostname)[0]
        const preserveParams = knownPattern.get(originalURL.hostname)[1];

        const parsedURL = new URL(cleanLink);
        if (replaceHost !== "") parsedURL.hostname = replaceHost;
        if (preserveParams[0] !== "") {
            let searchParams = new URLSearchParams(parsedURL.search);
            preserveParams.forEach(param => {
                if (originParams.has(param)) {
                    searchParams.append(param, originParams.get(param));
                }
            });
            parsedURL.search = searchParams.toString();
        }
        return parsedURL;
    } else {
        const result = await fetch(cleanLink, { redirect: "manual" });
        if (result.status === 301 || result.status === 302) {
            const location = result.headers.get("location");
            if (location) {
                const absoluteUrl = new URL(location, cleanLink);
                return absoluteUrl.toString().replace(/\?.*$/g, "");
            }
        }
    }
    return cleanLink;
}

export default handleUrl;
