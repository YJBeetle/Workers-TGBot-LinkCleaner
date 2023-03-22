import { requestTelegramBotAPI } from "./telegram";

async function handleCommand(text, chatID, userID) {
    const commandEndPos = text.indexOf(' ');
    const command = text.substring(1, commandEndPos == -1 ? undefined : commandEndPos).toLowerCase();
    const param = commandEndPos == -1 ? null : text.substring(commandEndPos + 1);

    switch (command) {
        case 'start': {
            await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: "我可以帮你删除链接中的跟踪信息，如抖音、B站短链，推特链接等。\n请试着给我发链接吧！" });
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

async function handleMessage(message, userID, chatID, type, msgId) {
    const pattern = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=+#]*)?/g;
    if (!message) return;

    if (message.startsWith("/")) {
        // Command
        await handleCommand(message, chatID, userID);
    } else {
        const rawLinks = message.match(pattern);
        if (rawLinks) {
            const result = await fetch(rawLinks[0], { method: "HEAD", redirect: "manual" });
            const location = result.headers.get("location") ?? rawLinks[0];
            const cleanLinks = location.replace(/(\?+.*)$/g, '');
            if (rawLinks[0] !== cleanLinks) {
                if (type === "group")
                    await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: cleanLinks, reply_to_message_id: msgId });
                else
                    await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: cleanLinks });
            } else if (type === "private") {
                await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: "该链接不需要清理跟踪参数哦，如果你认为这是个错误请向开发者反馈~" })
            }
        }
    }
}


async function handleTGBotUpdate(request) {
    try {
        const update = await request.json();
        const msg = update.message;
        const txt = msg.text;
        const msgId = msg.message_id;
        const type = msg.chat.type;
        const userID = msg.from.id;
        const chatID = msg.chat.id;

        if (txt) {
            await handleMessage(txt, userID, chatID, type, msgId);
        } else if (type === "private") {
            await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: "人家看不懂啦！" })
        }
    } catch (err) {
        console.log(err.stack);
    }
    return new Response(JSON.stringify({}), { headers: { "content-type": "application/json;charset=UTF-8" } });
}

export default handleTGBotUpdate;
