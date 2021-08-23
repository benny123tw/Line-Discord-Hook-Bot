import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import User from '../User';
export class Unsubscribe extends Command{

    constructor() {
        super(
            {
                name: 'unsubscribe',
                aliases: ['unsub'],
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

        await db.unsubscribe(sourceID);
    }

}