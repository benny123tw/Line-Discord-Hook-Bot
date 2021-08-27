import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import User from '../User';
import { FlexBubble, FlexCarousel, Message } from '@line/bot-sdk';
import { readFileSync } from 'fs';
import path from 'path';
import { deepCopy } from '../deep-copy';

export class List extends Command{

    constructor() {
        super(
            {
                name: 'list',
                aliases: ['l'],
                description: 'List all your subscribed server.'
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
            const users = await User.findOne({ sourceID: sourceID }).populate('guilds');
            const guilds = users?.guilds.map(guild => {
                return ({
                    id: guild.serverID,
                    name: guild.name,
                    icon: guild.icon
                });
            }) || [];

            if (!guilds?.length) {
                const message: Message = {
                    type: 'text',
                    text: '查無伺服器'
                }
                return reject(message);
            }

            const file = readFileSync(path.join(process.cwd(), 'src', 'flex', 'template_list.json'), 'utf8');
            const template: FlexCarousel = JSON.parse(file);
            const bubbleTemplate = template.contents[0];
            template.contents.shift();
            const _contents = template.contents;

            for (let guild of guilds) {                
                let bubble: FlexBubble = deepCopy(bubbleTemplate);

                if (bubble.action) {
                    if (bubble.action.type == 'message')
                        bubble.action.text = guild.id;
                }

                if (bubble.hero) 
                    if (bubble.hero.type == 'image') 
                        bubble.hero.url = guild.icon;
                    
                if (bubble.body) 
                    if (bubble.body.type == 'box') 
                        if (bubble.body.contents[0].type == 'box') 
                            if (bubble.body.contents[0].contents[0].type == 'text') 
                                bubble.body.contents[0].contents[0].text = guild.name;
                   
                _contents.push(bubble);
            }

            await client.pushMessage(sourceID, {
                type: 'flex',
                altText: 'List Command',
                contents: {
                    type: 'carousel',
                    contents: _contents
                }
            });

            let text = '';
            for (let i=0; i<guilds.length; i++) {
                text += `${i+1}. ${guilds[i].id}: ${guilds[i].name}\n`;
            }

            const message: Message = {
                type: 'text',
                text: text
            }
            resolve(message);
        })
    }

}