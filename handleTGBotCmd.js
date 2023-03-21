import { requestTelegramBotAPI } from "./telegram";

async function handleTGBotCmd(request, pathname) {
    if (pathname == '/TGBotCmd/setWebhook') {
        const result = await requestTelegramBotAPI("setWebhook", { "url": `${TG_WEBHOOK_URL}/${TG_BOT_TOKEN}` });
        return new Response(await result.text(), { headers: { "content-type": "text/plain" } });
    } else if (pathname == '/TGBotCmd/getWebhookInfo') {
        const result = await requestTelegramBotAPI("getWebhookInfo");
        return new Response((await result.text()).replace(TG_BOT_TOKEN, '<TG_BOT_TOKEN>'), { headers: { "content-type": "text/plain" } });
    } else if (pathname == '/TGBotCmd/getMe') {
        const result = await requestTelegramBotAPI("getMe");
        return new Response(await result.text(), { headers: { "content-type": "text/plain" } });
    } else
        return new Response("Unknow command.\n", { headers: { "content-type": "text/plain" } });
}

export default handleTGBotCmd;
