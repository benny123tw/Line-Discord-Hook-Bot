import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import User from '../User';

export class Notify extends Command{

    constructor() {
        super(
            {
                name: 'notify',
                aliases: ['n', 'noti'],
                description: 'Turn off all notifiications from servers.'
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
    }

}