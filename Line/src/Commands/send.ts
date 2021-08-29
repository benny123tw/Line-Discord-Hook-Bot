import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import User from '../User';
import { Discord } from '../Discord';

export class Send extends Command {

    constructor() {
        super(
            {
                permission: 'Premium',
                name: 'send',
                aliases: ['s'],
                description: '(Comming Soon) Send your Message to Specific Discord Server using your Line Profile.'
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

        const discord = new Discord(process.env.DC_WH_ID, process.env.DC_WH_TOKEN);
        await discord.sendMessage(args.join(' '), userInfo);
    }

}