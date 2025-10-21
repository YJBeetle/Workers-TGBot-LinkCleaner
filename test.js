#!/usr/bin/env node

import handleUrl from "./handleUrl.js";

const testLinks = [
    "https://x.com/elonmusk/status/1055653541317042177",
    "https://www.youtube.com/watch?v=ehaU6xriU0o",
    "https://youtu.be/ehaU6xriU0o?si=Az_lXgC11cLZJsXC",
];

for (const link of testLinks) {
    console.log(`Original: ${link}`);
    try {
        const cleanedLink = await handleUrl(link);
        console.log(`Cleaned:  ${cleanedLink}`);
    } catch (err) {
        console.log('Error:', err.message || err);
    }
    console.log('---');
}
