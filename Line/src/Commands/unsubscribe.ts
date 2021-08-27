import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import User from '../User';
import { Message } from '@line/bot-sdk';
export class Unsubscribe extends Command{

    constructor() {
        super(
            {
                name: 'unsubscribe',
                aliases: ['unsub'],
                description: 'Unsubscribe discord server.'
            }
        );
    }

    public async execute(options: CommandOptions) {        
        const {
            args,
            sourceID,
            event,
            client,
            db
        } = options;       

        return new Promise(async (resolve, reject) => {
            const users = await User.findOne({ sourceID: sourceID }).populate('guilds', 'serverID');
            const arr = users?.guilds.filter(guild => args.includes(guild.serverID)).map(guild => guild.serverID) || [];

            if ( !arr.length ) {
                const message: Message = {
                    type: 'text',
                    text: '請輸入正確的ID'
                }
                return reject(message);
            }
    
            for (let id of arr) {
                try {
                    await db.unsubscribe(sourceID, id);
                } catch (error) {
                    const message: Message = {
                        type: 'text',
                        text: `${id}: ${error}`
                    }
                    reject(message);
                }
            }

            const message: Message[] = [
                {
                    type: 'text',
                    text: '退訂閱成功!'
                },
                {
                    "type": "image",
                    "originalContentUrl": process.env.UnsubImage,
                    "previewImageUrl": process.env.UnsubImage
                }
            ]
            resolve(message);
        })        
    }

}