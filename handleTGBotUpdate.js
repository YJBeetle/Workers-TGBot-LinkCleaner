import { requestTelegramBotAPI } from "./telegram";

const URLpattern = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=+#]*)?/g;

async function handleUrl(originalLink) {
    const TWIpattern = /https:\/\/(vx)?twitter\.com/g;
    const cleanLink = originalLink.replace(/\?.*$/g, "");
    if (TWIpattern.test(cleanLink)) {
        return cleanLink.replace(TWIpattern, "https://vxtwitter.com");
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
        default: {
            // 未知指令
            await requestTelegramBotAPI("sendMessage", { chat_id: chat.id, text: "无路赛无路赛无路赛!" });
        } break;
    }
}

async function sendMessage(chat_id, text, reply_markup, reply_to_message_id) {
    const params = {
        chat_id,
        text,
        reply_to_message_id,
    };
    if (reply_markup) {
        params.reply_markup = reply_markup;
    }
    await requestTelegramBotAPI("sendMessage", params);
}

async function handleText({ text, chat, message_id }) {
    const rawLinks = text.match(URLpattern);
    let replymarkup = null;
    let replytext = "";

    if (!rawLinks) {
        replytext = chat.type !== "private" ? "" : "略略略";
    } else {
        const cleanedUrls = await Promise.all(rawLinks.map(handleUrl));
        const cleanIsNoNeeded = "链接不需要清理跟踪参数哦，如果你认为这是个错误请向开发者反馈~";
        if (1 === rawLinks.length) {
            const cleanedUrl = cleanedUrls[0];
            const rawLink = rawLinks[0];
            if (cleanedUrl === rawLink) {
                replytext += (chat.type === "private" ? "这个" + cleanIsNoNeeded + "" : "");
                await sendMessage(chat.id, replytext, null, chat.type !== "private" ? message_id : null);
            } else {
                const urlSearchParams = new URLSearchParams(rawLink.split("?")[1]);
                const params = Array.from(urlSearchParams.keys());
                if (params.length === 0) {
                    replytext = cleanedUrl;
                    await sendMessage(chat.id, replytext, null, chat.type !== "private" ? message_id : null);
                } else {
                    if (/https:\/\/vxtwitter\.com/g.test(cleanedUrl)) {
                        replytext += cleanedUrl;
                        await sendMessage(chat.id, replytext, null, chat.type !== "private" ? message_id : null);
                    } else {
                        replytext += cleanedUrl + "\n\n如果你对处理的结果不满意，请在下面选择要保留（或再次移除）的参数吧：";
                        keyboardButtons = params.map(param => [{ text: param, callback_data: param + "=" + urlSearchParams.get(param) }]);
                        replymarkup = { inline_keyboard: keyboardButtons };
                        await sendMessage(chat.id, replytext, replymarkup, chat.type !== "private" ? message_id : null);
                    }
                }
            }
        } else {
            cleanedUrls.forEach((url, index) => {
                replytext += url !== rawLinks[index] ? "" + url + "\n" : "第" + (index + 1) + "个" + cleanIsNoNeeded + "\n";
            });
            replytext += "\n\n🪢如果你对其中一些链接的处理结果不满意的话，还请你尝试将这些链接分开发送，每次只发送一条链接，以便更好地处理问题哦~\n";
            await sendMessage(chat.id, replytext, null, chat.type !== "private" ? message_id : null);
        }
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

async function handleCallbackQuery(callbackQuery) {
    const chat_id = callbackQuery.message.chat.id;
    const message_id = callbackQuery.message.message_id;
    const data = callbackQuery.data;
    const param = data.split('=')[0];
    const value = data.split('=')[1];
    const url = callbackQuery.message.text.split('\n\n')[0];
    const txt = callbackQuery.message.text.split('\n\n')[1];
    try {
        let newUrl = new URL(url);
        let newUrlParam = new URLSearchParams(newUrl.search);
        if (newUrlParam.has(param)) {
            newUrlParam.delete(param);
        } else {
            newUrlParam.append(param, value);
        }
        newUrlParam.sort();
        newUrl.search = newUrlParam.toString();

        const response = await requestTelegramBotAPI("editMessageText", {
            chat_id,
            message_id,
            reply_markup: callbackQuery.message.reply_markup,
            text: newUrl + '\n\n' + txt,
        });
    } catch (error) {
        console.error(error);
    }
}

async function handleInlineQuery(inline_query) {
    console.log("inline_query:", inline_query);
    console.log("inline_query.id:", inline_query.id);
    const userID = inline_query.from.id;
    console.log("userID:", userID);
    const query = inline_query.query;
    console.log("query:", query);

    const rawLinks = query.match(URLpattern);
    if (!rawLinks) {
        await requestTelegramBotAPI("answerInlineQuery", {
            inline_query_id: inline_query.id,
            results: [
                {
                    type: 'article',
                    id: 0,
                    title: '在这里输入链接就行了',
                    input_message_content: {
                        message_text: query,
                    },
                },
            ]
        });
    } else {
        const result = await Promise.all(rawLinks.map(async rawLink => ({ raw: rawLink, cleaned: await handleUrl(rawLink) })));
        console.log("result:", result);

        let replyText = query;
        result.forEach(e => replyText = replyText.replace(e.raw, e.cleaned));
        console.log("replyText:", replyText);

        await requestTelegramBotAPI("answerInlineQuery", {
            inline_query_id: inline_query.id,
            results: [
                {
                    type: 'article',
                    id: 0,
                    title: '点击发送清理后的结果',
                    input_message_content: {
                        message_text: replyText,
                    },
                },
            ]
        });
    }
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
