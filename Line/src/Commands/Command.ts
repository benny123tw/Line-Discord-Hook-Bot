import { CommandConfig, CommandOptions } from '../Declare/Command';
import { Collection } from 'discord.js';

export class Command implements CommandConfig{

    public name: string;
    public aliases: string[];
    public description: string;

    static commands: Collection<Command['name'], Command> = new Collection();

    constructor(config: CommandConfig) {
        this.name = config.name;
        this.aliases = config.aliases;
        this.description = config.description;
        Command.commands.set(this.name, this);
    }

    public execute(options: CommandOptions) {

        
    }
}