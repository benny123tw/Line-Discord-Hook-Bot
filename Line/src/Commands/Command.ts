import { CommandConfig, CommandOptions, membership } from '../Declare/Command';
import { Collection } from 'discord.js';


export class Command implements CommandConfig{

    public name: string;
    public aliases: string[];
    public description: string;
    public permission: membership = 'Free';

    static commands: Collection<Command['name'], Command> = new Collection();

    constructor(config: CommandConfig) {
        this.name = config.name;
        this.aliases = config.aliases;
        this.description = config.description;
        this.permission = config.permission;
        Command.commands.set(this.name, this);
    }

    public execute(options: CommandOptions): any {

        
    }
}