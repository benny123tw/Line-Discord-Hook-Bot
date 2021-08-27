import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import { Client, FlexBubble, FlexCarousel } from '@line/bot-sdk';
import { readFileSync, readdirSync } from 'fs';
import * as path from 'path';
import { deepCopy } from '../deep-copy';

export class Help extends Command {

    constructor() {
        super(
            {
                name: 'help',
                aliases: ['h'],
                description: 'List all commands.'
            }
        );
    }

    public async execute(options: CommandOptions) {
        const {
            event,
            client,
            sourceID
        } = options;

        await this.carousel(client, sourceID);
    }

    private async carousel(client: Client, sourceID: string) {
        const file = readFileSync(path.join(process.cwd(), 'src', 'flex', 'template_help.json'), 'utf8');
        const template: FlexCarousel = JSON.parse(file);
        const bubbleTemplate = template.contents[0];
        template.contents.shift();
        const _contents = template.contents;
        const commands = Command.commands;

        const PREVIEW_IMAGE_PATH = path.join(process.env.ASSETS_URL, 'preview');
        
        let index = 0;
        for (let command of commands) {
            let bubble: FlexBubble = deepCopy(bubbleTemplate);

            const cmdName = command[1].name.slice(0, 1).toUpperCase() + command[1].name.slice(1);

            if (!bubble.body) return;

            // Image 
            if (bubble.hero?.type == 'image')
                bubble.hero.url = PREVIEW_IMAGE_PATH + `/${command[1].name}.jpg`;

            // Tilte
            if (bubble.body.contents[0].type == 'text') 
                    bubble.body.contents[0].text = cmdName;

            // Description
            if (bubble.body.contents[1].type == 'box')
                if (bubble.body.contents[1].contents[0].type == 'text')
                    bubble.body.contents[1].contents[0].text = command[1].description;

            // Button
            if (bubble.footer)
                if (bubble.footer.type == 'box')
                    if (bubble.footer.contents[1].type == 'button') {
                        bubble.footer.contents[1].action.label = cmdName;
                    if (bubble.footer.contents[1].action.type == 'message')
                        bubble.footer.contents[1].action.text = cmdName + '指令發送!';
                }
                          
                _contents.push(bubble);  
        }

        await client.pushMessage(sourceID, {
            type: 'flex',
            altText: 'Help Command',
            contents: {
                type: 'carousel',
                contents: _contents
            }
        })
    }

}