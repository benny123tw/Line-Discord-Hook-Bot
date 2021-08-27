import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import User from '../User';
import { Discord } from '../Discord';

export class Send extends Command {

    constructor() {
        super(
            {
                name: 'send',
                aliases: ['s'],
                description: 'Send your Message to Discord Server.'
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