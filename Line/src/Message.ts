import { WebhookEvent, MessageAPIResponseBase, Client } from "@line/bot-sdk";
import axios from "axios";
import { Discord } from "./Discord";
import { connect } from "mongoose";
import { MongoDB } from "./MongoDB";
import { Command } from "./Commands/Command";

export default async (event: WebhookEvent, client: Client, database: MongoDB): Promise<MessageAPIResponseBase | undefined> => {

    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    if (!process.env.MONGODB_SRV) {
        client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'Sorry! Can\'t connect to Databse now!'
        });
    };

    // Process all message related variables here.
    const { replyToken } = event;
    let { text } = event.message;

    if ( !text.startsWith('.d') ) return;
    const args: string[] = text.split(/ +/).slice(1);
    const cmd: string | undefined = args.shift()?.toLowerCase();

    let sourceID = event.source.type == 'group' ? event.source.groupId : event.source.userId;

    const baseURL = 'https://api.line.me/v2/bot/';
    const url = event.source.type == 'group' ? baseURL + 'group/' + sourceID + '/summary' : baseURL + 'profile/' + sourceID;

    const { data } = await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization:
                'Bearer {' + process.env.CHANNEL_ACCESS_TOKEN + '}',
        },
    });

    if (!sourceID) return;

    await database.createDB(sourceID, event.source.type === "group" ? data.groupName : data.displayName);

    console.log('cmd: ' + cmd)
    
    if (cmd) {
        Command.commands.get(cmd)?.execute({
            message: text,
            args: args,
            cmd: cmd,
            event: event,
            db: database
        });
        console.log('Command execute success')
    }


    
    const discord = new Discord(process.env.DC_WH_ID, process.env.DC_WH_TOKEN);

    await discord.sendMessage(text, data);

    return await client.pushMessage(sourceID, [
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

