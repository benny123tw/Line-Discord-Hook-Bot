import { WebhookEvent, MessageAPIResponseBase, Client } from "@line/bot-sdk";
import axios from "axios";
import { Discord } from "./Discord";

export default async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {

    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    // Process all message related variables here.
    const { replyToken } = event;
    const { text } = event.message;

    const { data } = await axios.get('https://api.line.me/v2/bot/profile/' + event.source.userId, {
        headers: {
            'Content-Type': 'application/json',
            Authorization:
                'Bearer {' + process.env.CHANNEL_ACCESS_TOKEN + '}',
        },
    });

    const discord = new Discord(process.env.DC_WH_ID, process.env.DC_WH_TOKEN);

    await discord.sendMessage(text, data);

    if (!event.source.userId) return;

    return await client.pushMessage(event.source.userId, [
        {
            type: "text",
            text: "Discord Server Recieved Your Message!"
        }, 
        {
            "type": "sticker",
            "packageId": "446",
            "stickerId": "1988"
        },
        {
            "type": "template",
            "altText": "Accept Invite",
            "template": {
                "type": "confirm",
                "text": "Are you sure?",
                "actions": [
                    {
                      "type": "uri",
                      "label": "Yes",
                      "uri": "https://discord.gg/4cQRHcUk"
                    },
                    {
                      "type": "message",
                      "label": "No",
                      "text": "no"
                    }
                ]
            }
          }
    ]);
}

