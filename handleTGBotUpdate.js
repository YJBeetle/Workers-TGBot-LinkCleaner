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

async function handleText(message, userID, chatID, type, msgId) {
    const URLpattern = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=+#]*)?/g;
    const TWIpattern = /https:\/\/(vx)?twitter\.com/g;
    if (!message) return;

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

async function handleMessage(message) {
    const userID = message.from.id;
    const chatID = message.chat.id;
    if (message.text) {
        const text = message.text;
        if (text.startsWith("/")) {
            // Command
            await handleCommand(text, chatID, userID);
        } else {
            // 处理用户消息
            const msg = message;
            const txt = msg.text;
            const msgId = msg.message_id;
            const type = msg.chat.type;
            const userID = msg.from.id;
            const chatID = msg.chat.id;

            await handleText(txt, userID, chatID, type, msgId);
        }
    } else {
        // 未知内容类型
        if (type === "private") {
            await requestTelegramBotAPI("sendMessage", { chat_id: chatID, text: "人家看不懂啦！" })
        }
    }
}

async function handleCallbackQuery(callback_query) {
    console.log(callback_query);
    const userID = callback_query.from.id;
    const chatID = callback_query.message.chat.id;
    console.log("userID:", userID);
    console.log("chatID:", chatID);
    const data = JSON.parse(callback_query.data);
    console.log("data:", data);
    await requestTelegramBotAPI("answerCallbackQuery", { callback_query_id: callback_query.id, text: "喵", show_alert: true });
}

async function handleInlineQuery(inline_query) {
    console.log("inline_query:", inline_query);
    console.log("inline_query.id:", inline_query.id);
    const userID = inline_query.from.id;
    console.log("userID:", userID);
    const query = inline_query.query;
    console.log("query:", query);
    await requestTelegramBotAPI("answerInlineQuery", {
        inline_query_id: inline_query.id,
        results: [
            {
                type: 'article',
                id: 0,
                title: '点我试试？',
                input_message_content: {
                    message_text: '你点我了！我生气了！',
                },
            },
        ]
    });
}

async function handleTGBotUpdate(request) {
    try {
        const update = await request.json();
        if (update.message)
            await handleMessage(update.message);
        else if (update.callback_query)
            await handleCallbackQuery(update.callback_query);
        else if (update.inline_query)
            await handleInlineQuery(update.inline_query);
    } catch (err) {
        console.log(err.stack);
    }
    return new Response(JSON.stringify({}), { headers: { "content-type": "application/json;charset=UTF-8" } });
}

export default handleTGBotUpdate;
