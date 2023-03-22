# Workers-TGBot-BiliAntiTracking

这是个简单的Bot，用于将bilibili短链接解析为BV号URL并返回给用户。

这个Bot设计用于在Cloudflare Workers上运行

## 部署至Workers

首先安装此文档安装wrangler https://developers.cloudflare.com/workers/wrangler/install-and-update/ 。

将`wrangler.example.toml`复制一份命名为`wrangler.toml`，并且编辑填写`TG_WEBHOOK_URL`和`TG_BOT_TOKEN`。

其中`TG_WEBHOOK_URL`为Cloudflare Workers实例的域名，而`TG_BOT_TOKEN`可通过 https://t.me/BotFather 获取。

执行`npx wrangler publish`部署至Workers。

## 设置Telegram Webhook地址

首次部署后需要进行一次性的Telegram Webhook地址设置。

访问您部署的Cloudflare Workers实例加后缀`/TGBotCmd/setWebhook`即可。