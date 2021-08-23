import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import User from '../User';
export class Subscribe extends Command{

    constructor() {
        super(
            {
                name: 'subscribe',
                aliases: ['sub'],
                description: ''
            }
        );
    }

    public async execute(options: CommandOptions) {        
        const {
            args,
            event,
            db
        } = options;        
        const sourceID = event.source.type == 'group' ? event.source.groupId : event.source.userId;
        if (!sourceID) return;

        await db.subscribe(sourceID);
    }

}