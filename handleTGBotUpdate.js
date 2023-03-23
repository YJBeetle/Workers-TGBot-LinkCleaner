import { requestTelegramBotAPI } from "./telegram";

async function handleUrl(originalLink) {
    const TWIpattern = /https:\/\/(vx)?twitter\.com/g;

    let cleanLink = originalLink.replace(/\?.*$/g, "");

    if (TWIpattern.test(originalLink)) {
        cleanLink = cleanLink.replace(TWIpattern, "https://vxtwitter.com");
    } else {
        const result = await fetch(originalLink, { method: "HEAD", redirect: "manual" });
        const location = result.headers.get("location") ?? originalLink;
        cleanLink = location.replace(/\?.*$/g, "");
    }

    return cleanLink;
}

async function handleCommand({ text, chat }) {
    const commandEndPos = text.indexOf(' ');
    const command = text.substring(1, commandEndPos == -1 ? undefined : commandEndPos).toLowerCase();
    const param = commandEndPos == -1 ? null : text.substring(commandEndPos + 1);

    switch (command) {
        case 'start': {
            await requestTelegramBotAPI("sendMessage", { chat_id: chat.id, text: "我可以帮你删除链接中的跟踪信息，如抖音、B站短链等，或将twitter链接转换为Telegram中可直接预览的vxtwitter链接。\n请试着给我发链接吧！" });
        } break;
        case 'help': {
            await requestTelegramBotAPI("sendMessage", { chat_id: chat.id, text: "直接给我发链接就行啦！" });
        } break;
        case 'test': {
            await requestTelegramBotAPI("sendMessage", {
                chat_id: chat.id,
                text: '鲨狸怎么叫',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '咩咩咩',
                                callback_data: JSON.stringify({ event: 'test', value: 1 }),
                            },
                            {
                                text: '喵喵喵',
                                callback_data: JSON.stringify({ event: 'test', value: 2 }),
                            },
                            {
                                text: '汪汪汪',
                                callback_data: JSON.stringify({ event: 'test', value: 3 }),
                            },
                        ],
                        [
                            {
                                text: '大楚兴陈胜王',
                                callback_data: JSON.stringify({ event: 'test', value: 4 }),
                            },
                        ],
                    ],
                },
            });
        } break;
        default: {
            // 未知指令
            await requestTelegramBotAPI("sendMessage", { chat_id: chat.id, text: "无路赛无路赛无路赛!" });
        } break;
    }
}

async function handleText({ text, chat, message_id }) {
    const rawLinks = text.match(/(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/gs);
    if (rawLinks) {
        let replytext = ''

        for (const url of rawLinks) {
            const cleanedUrl = await handleUrl(url)
            if (cleanedUrl !== url)
                replytext += cleanedUrl + '\n'
        };
        if (!replytext && chat.type !== "private") replytext = "该链接不需要清理跟踪参数哦，如果你认为这是个错误请向开发者反馈~";

        await requestTelegramBotAPI("sendMessage", {
            chat_id: chat.id,
            text: replytext,
            reply_to_message_id: (chat.type !== "private") ? message_id : null
        });
    }
}

async function handleMessage(message) {
    // 在此处理不同消息类型 如 文本
    if (message.text) {
        if (message.text.startsWith("/")) {
            // Command
            await handleCommand(message);
        } else {
            await handleText(message);
        }
    } else {
        // 未知内容类型
        if (message.chat.type === "private") {
            await requestTelegramBotAPI("sendMessage", { chat_id: message.chat.id, text: "人家看不懂啦！" })
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
    switch (data.event) {
        case 'test': {
            if (data.value == 4) {
                await requestTelegramBotAPI("sendMessage", { chat_id: callback_query.message.chat.id, text: "对！狐狸就是这么叫！" });
            } else {
                await requestTelegramBotAPI("sendMessage", { chat_id: callback_query.message.chat.id, text: "哼！" });
            }
        } break;
        default:
            await requestTelegramBotAPI("answerCallbackQuery", { callback_query_id: callback_query.id, text: "这个按钮可能已经过时，请重新发送指令。", show_alert: true });
            return;
    }
    await requestTelegramBotAPI("answerCallbackQuery", { callback_query_id: callback_query.id });
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
