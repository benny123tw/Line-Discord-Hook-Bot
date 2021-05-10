import { CommandConfig, CommandOptions, permissions } from "src/Command";

export class Command implements CommandConfig {

    public name: string;
    public aliases: string[];
    public permissions: permissions[];
    public description: string;

    constructor (config: CommandConfig) {
        this.name = config.name;
        this.aliases = config.aliases;
        this.permissions = config.permissions;
        this.description = config.description;
    }

    execute(options: CommandOptions) {
        
    }


}