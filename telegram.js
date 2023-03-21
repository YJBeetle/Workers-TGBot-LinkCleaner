async function requestTelegramBotAPI(method, payload) {
    return fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/${method}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: !payload ? undefined : JSON.stringify(payload)
    });
}

export { requestTelegramBotAPI };
