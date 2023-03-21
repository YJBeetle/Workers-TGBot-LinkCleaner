import { requestTelegramBotAPI } from "./telegram";

async function handleCommand(text, chatID, userID) {
    const commandEndPos = text.indexOf(' ');
    const command = text.substring(1, commandEndPos == -1 ? undefined : commandEndPos).toLowerCase();
    const param = commandEndPos == -1 ? null : text.substring(commandEndPos + 1);

    switch (command) {
        case 'start': {
            await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: "我可以帮你删除Bilibili短链接的跟踪信息。" });
            await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: "请试着给我发链接吧！" });
        } break;
        case 'help': {
            await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: "直接给我发链接就行啦！" });
        } break;
        default: {
            // 未知指令
            await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: "无路赛无路赛无路赛!" });
        } break;
    }
}

async function handleMessage(message) {
    console.log('----------- TG UPDATE MESSAGE -----------');
    console.log("message:", message);
    console.log("message.chat:", message.chat);
    const userID = message.from.id;
    const chatID = message.chat.id;
    console.log("userID:", userID);
    console.log("chatID:", chatID);
    if (message.text) {
        console.log("message type:", "text");
        const text = message.text;
        console.log("text:", text);
        if (text.startsWith("/")) {
            // Command
            await handleCommand(text, chatID, userID);
        } else {
            if (text.startsWith("https://b23.tv/") || text.startsWith("http://b23.tv/") || text.startsWith("b23.tv/")) {
                const result = await fetch(text, { method: "GET", redirect: "manual" })
                const location = result.headers.get('location')
                const bv = location.match(/https:\/\/www.bilibili.com\/video\/(.*?)\?/)[1]
                console.log("text: ", text);
                await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: `https://www.bilibili.com/video/${bv}` });
            }
        }
    } else {
        // 未知内容类型
        await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: "人家看不懂啦！" });
    }
    console.log('----------- TG UPDATE MESSAGE END -----------');
}

async function handleTGBotUpdate(request) {
    try {
        console.log("=========== TG UPDATE ===========");
        const update = await request.json();
        console.log("update_id:", update.update_id);
        if (update.message) {
            console.log("type:", "message");
            await handleMessage(update.message);
        } else {
            console.log("type:", "unknow");
        }
        console.log("=========== TG UPDATE END ===========");
    } catch (err) {
        console.log(err.stack);
    }
    return new Response(JSON.stringify({}), { headers: { "content-type": "application/json;charset=UTF-8" } });
}

export default handleTGBotUpdate;
