import { WebhookEvent, MessageAPIResponseBase, Client, Message } from "@line/bot-sdk";
import axios from "axios";
import { dbOptions, MongoDB } from "./MongoDB";
import { Command } from "./Commands/Command";

export default async (event: WebhookEvent, client: Client, database: MongoDB): Promise<MessageAPIResponseBase | undefined> => {

    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    // Process all message related variables here.
    const { replyToken } = event;
    let { text } = event.message;

    if ( !text.startsWith(process.env.PREFIX) ) return;
    const args: string[] = text.slice(process.env.PREFIX.length).split(/ +/);
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

    const options: dbOptions = {
        sourceID: sourceID,
        username: event.source.type === "group" ? data.groupName : data.displayName
    }

    const user = await database.findOrCreate(options);

    console.log('cmd: ' + cmd)

    if (!cmd) return;

    const command = 
        Command.commands.get(cmd) || Command.commands.find((c) => c.aliases && c.aliases.includes(cmd));

    if (!command) return await client.pushMessage(sourceID, 
        {
            type: "text",
            text: `查無 「 ${cmd} 」 指令!` 
        }
    );       

    try {
        if (command.permission == 'Premium' && user.membership != 'Premium') {
            return await client.pushMessage(sourceID, {
                type: 'text',
                text: `欲使用 「${command.name}」 指令請升級會員。`
            });
        }

        const result = await command.execute({
            args: args,
            userInfo: data,
            client: client,
            db: database,
            event: event,
            sourceID: sourceID,
        });

        if (!result) return;
        
        if ( typeof result === "object" ) 
            await client.pushMessage(sourceID, result);
        else
            await client.pushMessage(sourceID, {
                type: "text",
                text: result
            });
        
    } catch (error) {
        if ( typeof error === "object" ) 
            await client.pushMessage(sourceID, error);
        else
            await client.pushMessage(sourceID, {
                type: "text",
                text: error
            });
    };

}

