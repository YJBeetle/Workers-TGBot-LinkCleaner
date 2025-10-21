#!/usr/bin/env node

import handleUrl from "./handleUrl.js";

const testLinks = [
    "https://x.com/elonmusk/status/1055653541317042177",
    "https://www.youtube.com/watch?v=ehaU6xriU0o",
    "https://youtu.be/ehaU6xriU0o?si=Az_lXgC11cLZJsXC",
    "https://e.tb.cn/h.SQ3lj1My5camvdq?tk=sOOsf2IiMsE",
    "https://item.taobao.com/item.htm?id=15232975357&price=200&sourceType=item&sourceType=item&suid=18e81b0f-b7bd-4947-93b8-e8e934086138&shareUniqueId=33572639420&ut_sk=1.ZdHkwdAPeq8DAIniWah5l27J_21646297_1761005357625.Copy.1&un=4f8d49879fdef21d875dbdeffcd1c5a5&share_crt_v=1&un_site=0&spm=a2159r.13376460.0.0&wxsign=tbwo-sto_yI-peSXEprsFZLOmeDgAriIta33LdJ3_FkLPG-b8HKg6TSfvrn8aNCu3nXtK2qKDsyEBFt6LHh5ETuRa_JNwrr5u2WDzZQqlM7T1edbZZX7JTaHC7JdBYZjamz&tbSocialPopKey=shareItem&sp_tk=c09Pc2YySWlNc0U%3D&cpp=1&shareurl=true&short_name=h.SQ3lj1My5camvdq&bxsign=scdM3QjzfjNuZ3bhU5UEOW5BZ3FPsX_PAYKGlm3ANWpB24s56eIDxaBhv-WOiVoNxQqEkB6qxeRS_90Mott7vhXEGFtJbJU1LHe9GxuDnRaoYCRG4gvkgxCS1DAb7MoFrZH&tk=sOOsf2IiMsE&app=chrome",
    "https://detail.tmall.com/item.htm?app=chrome&bxsign=scddjSHee5njkS15wQ4yHn56kBHU3yPzpnthilt6qduuzbmqouex6A7NPMHc84mKiqQ97xtHHxl2E-5N1L0WQCrzCITFHE_TdydLnUaQomrzl7cNMZ9Lp5BbaOWDL7azK1T&cpp=1&id=15232975357&price=200&shareUniqueId=33572639420&share_crt_v=1&shareurl=true&short_name=h.SQ3lj1My5camvdq&sourceType=item&sp_tk=c09Pc2YySWlNc0U%3D&spm=a2159r.13376460.0.0&suid=18e81b0f-b7bd-4947-93b8-e8e934086138&tbSocialPopKey=shareItem&tk=sOOsf2IiMsE&un=4f8d49879fdef21d875dbdeffcd1c5a5&un_site=0&ut_sk=1.ZdHkwdAPeq8DAIniWah5l27J_21646297_1761005357625.Copy.1&wxsign=tbwo-sto_yI-peSXEprsFZLOmeDgAriIta33LdJ3_FkLPG-b8HKg6TSfvrn8aNCu3nXtK2qKDsyEBFt6LHh5ETuRa_JNwrr5u2WDzZQqlM7T1edbZZX7JTaHC7JdBYZjamz",
    "https://detail.tmall.com/item.htm?abbucket=16&id=678762174873&pisk=g7jrosZfVHfX31GbVsKEQR6Uu4-JmHPsqMOBK9XHFQAlOa_ETs5FFb_CKpjFOsxB-7K5Ys5hTD_5V3T3xI9E-40oxjxDdpmk-MOCYYIV_Di7wzBnYHt315Z_fTHJvHV6hDFWKbpJULqBEUxD2pZvfsMafTBJ9Yl3CZqsLbj5Ey0Ht6xDoL96xpmox--DQp-nqemlnIAvKHxHZHcmmpvrr0mkt-uDILco-eYoiKvJB0xHx6X03pdDEHxhtt22pfGBiCr2ZU2fFBCUjrrprCXkgDmZHL8utTgIYDRWEUShnIJXhiJyzCYnyumlbOXlXpSLI2RFdafWH6ragnjPagY2YkovVO7caE7zTm8AoOIHuZFZWOBlaNYGqoyfTsXOW3ju90OR-tjHGg2IYCb1BnJAASnkTZbhVUKKZ7JV4OSF8gkm9KV73MQrt28kHKR_3-rbIhHAJEM8T23po2p21RWZJ2Ll6KR_3-uKJEVJ3CwNQ&rn=54b6db4b497cd9193e5626304967c89d&skuId=5040017158645&spm=a1z10.5-b.w4011-24399291437.51.12311b6d1F0aMd",
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
