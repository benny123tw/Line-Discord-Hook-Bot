import { Profile } from '@line/bot-sdk/dist/types';
import { WebhookClient } from 'discord.js';

export class Discord extends WebhookClient {


    constructor(id: string, token: string) {
        super(id, token);
    }

    async sendEmbedMessage(content: string, profile: Profile): Promise<any> {
        return super.send({
            username: "Line",
            avatarURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/LINE_New_App_Icon_%282020-12%29.png/600px-LINE_New_App_Icon_%282020-12%29.png",
            embeds: [
                {
                    description: content,
                    color: '#06C755', // Hexdecimal
                    author: {
                        name: profile.displayName,
                        icon_url: profile.pictureUrl
                    },
                    footer: {
                        text: "Copyright ©️ 2021 Line&Discord Hook Bot."
                    }

                }
            ]
        });
    }

    async sendMessage(content: string, profile: Profile): Promise<any> {
        return super.send(content, {
            username: profile.displayName,
            avatarURL: profile.pictureUrl,
        })
    }


}