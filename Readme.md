# Workers-TGBot-BiliAntiTracking

这是个简单的Bot，用于将bilibili短链接解析为BV号URL并返回给用户。

这个Bot设计用于在Cloudflare Workers上运行

## 环境

若这是您首次使用Cloudflare Workers，则需按本章节操作。

按照此文档安装wrangler https://developers.cloudflare.com/workers/wrangler/install-and-update/ 。

执行`npx wrangler login`登陆您的Cloudflare账户。

## 部署至Workers

执行`npx wrangler publish`部署至Workers。

## 设置Telegram Token至Cloudflare Workers Secret

通过 https://t.me/BotFather 获取您的Bot的Token。

执行`npx wrangler secret put TG_BOT_TOKEN`，并在下方填入刚才获取的Token。

## 设置Telegram Webhook地址

首次部署后需要进行一次性的Telegram Webhook地址设置。

访问您部署的Cloudflare Workers实例加后缀`/TGBotCmd/setWebhook`即可。