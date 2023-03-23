import { requestTelegramBotAPI } from "./telegram";

async function handleCommand(text, chatID, userID) {
    const commandEndPos = text.indexOf(' ');
    const command = text.substring(1, commandEndPos == -1 ? undefined : commandEndPos).toLowerCase();
    const param = commandEndPos == -1 ? null : text.substring(commandEndPos + 1);

    switch (command) {
        case 'start': {
            await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: "我可以帮你删除链接中的跟踪信息，如抖音、B站短链等，或将twitter链接转换为Telegram中可直接预览的vxtwitter链接。\n请试着给我发链接吧！" });
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
    const URLpattern = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=+#]*)?/g;
    const TWIpattern = /https:\/\/(vx)?twitter\.com/g;
    if (!message) return;

    if (message.startsWith("/")) {
        // Command
        await handleCommand(message, chatID, userID);
    } else {
        const rawLinks = message.match(URLpattern);
        if (rawLinks) {
            const [originalLink] = rawLinks;
            let cleanLink = originalLink.replace(/\?.*$/g, "");

            if (TWIpattern.test(originalLink)) {
                cleanLink = cleanLink.replace(TWIpattern, "https://vxtwitter.com");
            } else {
                const result = await fetch(originalLink, { method: "HEAD", redirect: "manual" });
                const location = result.headers.get("location") ?? originalLink;
                cleanLink = location.replace(/\?.*$/g, "");
            }

            const messageData = { chat_id: chatID };

            if (originalLink !== cleanLink) {
                messageData.text = cleanLink;
            } else {
                messageData.text = "该链接不需要清理跟踪参数哦，如果你认为这是个错误请向开发者反馈~"
            }

            if (type !== "private") {
                messageData.reply_to_message_id = msgId;
            }

            await requestTelegramBotAPI("sendMessage", messageData);
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
