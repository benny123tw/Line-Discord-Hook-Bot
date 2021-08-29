import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import User from '../User';
import fs, { readFileSync } from 'fs';
import path from 'path';
import { FlexBubble, FlexCarousel, Message } from '@line/bot-sdk';
import { deepCopy } from '../deep-copy';

export class Status extends Command {

    constructor() {
        super(
            {
                permission: 'Free',
                name: 'status',
                aliases: ['st'],
                description: 'Show your information from our database.'
            }
        );
    }

    public async execute(options: CommandOptions) {
        const {
            args,
            userInfo,
            sourceID,
            event,
            client,
            db
        } = options;

        return new Promise(async (resolve, reject) => {
            const user = await User.findBySourceID(sourceID);
            const file = readFileSync(path.join(process.cwd(), 'src', 'flex', 'template_status.json'), 'utf8');
            const bubble: FlexBubble = JSON.parse(file);
    
            if (bubble.hero?.type == 'image')
                bubble.hero.url = userInfo.pictureUrl || process.env.ASSETS_URL + 'server-logo';
            
            if (!bubble.body) return;
    
            if (bubble.body.contents[1].type == 'text')
                bubble.body.contents[1].text = userInfo.displayName || userInfo.groupName; 
    
            if (bubble.body.contents[2].type == 'text')
                bubble.body.contents[2].text = userInfo.statusMessage || `Bot Version: v${process.env.npm_package_version}`;
    
            if (bubble.body.contents[4].type == 'box') {
                if (bubble.body.contents[4].contents[0].type == 'box') 
                    if (bubble.body.contents[4].contents[0].contents[1].type == 'text')
                        bubble.body.contents[4].contents[0].contents[1].text =  user.membership;
                
                if (bubble.body.contents[4].contents[1].type == 'box') 
                    if (bubble.body.contents[4].contents[1].contents[1].type == 'text')
                        bubble.body.contents[4].contents[1].contents[1].text = user.notify ? 'ON' : 'OFF';
    
                if (bubble.body.contents[4].contents[2].type == 'box') 
                    if (bubble.body.contents[4].contents[2].contents[1].type == 'text')
                        bubble.body.contents[4].contents[2].contents[1].text = user.guilds.length.toString();
            }
                
            if (bubble.body.contents[6].type == 'box')
                if (bubble.body.contents[6].contents[1].type == 'text')
                    bubble.body.contents[6].contents[1].text = '#' + sourceID.slice(0,5) + '*****';
    
            const message: Message = {
                type: 'flex',
                altText: 'Status Command',
                contents: bubble
            }

            return resolve(message);
        })
    }

}