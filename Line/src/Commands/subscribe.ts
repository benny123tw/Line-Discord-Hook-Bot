import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import Server from '../Server';
import { Message } from '@line/bot-sdk';
import User from '../User';
export class Subscribe extends Command {

    constructor() {
        super(
            {
                permission: 'Free',
                name: 'subscribe',
                aliases: ['sub'],
                description: 'Subscribe to the discord server.'
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

        const user = await User.findOne({ sourceID: sourceID }).populate('guilds', 'serverID');

        const subedArray = user?.guilds ? user?.guilds.map(guild => guild.serverID) : [];

        const exsistArray: string[] = await this.validID(args, subedArray);

        return new Promise<string | Message | Message[]>(async (resolve, reject) => {
            if (!this.compareID(args, subedArray) && !exsistArray.length) {
                const message: Message = {
                    type: 'text',
                    text: '重複訂閱!'
                }
                return reject(message);
            }

            if (!exsistArray.length) {
                const imagesArr: string[] = ['sub_pic01.png', 'sub_pic02.png', 'sub_pic03.png'];
                const messageArr: Message[] = [];

                imagesArr.forEach(image => {
                    const IMAGE_PATH = process.env.ASSETS_URL + 'guide/' + image;
                    messageArr.push({
                        "type": "image",
                        "originalContentUrl": IMAGE_PATH,
                        "previewImageUrl": IMAGE_PATH
                    });
                })

                await client.pushMessage(sourceID, {
                    "type": "text",
                    "text": "請輸入Discord伺服器的ID，請參照以下圖片。"
                });

                await client.pushMessage(sourceID, messageArr);

                const message: Message = {
                    type: 'text',
                    text: '訂閱失敗!'
                }
                return reject(message);
            }

            for (let id of exsistArray) {
                await db.subscribe(sourceID, id);
            }

            const message: Message[] = [
                {
                    type: "text",
                    text: '訂閱成功'
                },
                {
                    "type": "image",
                    "originalContentUrl": process.env.SubImage,
                    "previewImageUrl": process.env.SubImage
                }
            ]

            return resolve(message);
        });

    }

    private async validID(id: string[], subedArray: string[]): Promise<Array<string>> {
        const exsistArray: string[] = [];

        for (let i = 0; i < id.length; i++) {
            if (subedArray.includes(id[i])) continue;
            await Server.exists({ serverID: id[i] }) ? exsistArray.push(id[i]) : null;
        }

        return exsistArray;
    }

    private compareID(arr: string[], subedArray: string[]) {
        return arr.every((c) => !subedArray.includes(c));
    }

}