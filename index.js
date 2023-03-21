import { requestTelegramBotAPI } from "./telegram";
import handleTGBotCmd from "./handleTGBotCmd";
import handleTGBotUpdate from "./handleTGBotUpdate";

addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request)
        /* Debug only */
        // .catch(
        //     err => new Response(err.stack, { status: 500 })
        // )
    );
});

async function handleRequest(request) {
    const { pathname } = new URL(request.url);
    if (request.method == "POST" && request.headers.get("Content-Type").startsWith("application/json") && pathname == `/${TG_BOT_TOKEN}`)
        return handleTGBotUpdate(request);
    else if (request.method == "GET" && (pathname.startsWith('/TGBotCmd/') || pathname == '/TGBotCmd'))
        return handleTGBotCmd(request, pathname);
    else if (request.method == "GET" && pathname == '/state')
        return new Response("I'm alive.\n", { headers: { "content-type": "text/plain" } });
    else
        return new Response("Error.\n", { headers: { "content-type": "text/plain" } });
}
