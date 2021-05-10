import { CommandConfig, CommandOptions, permissions } from "src/Command";
import { Command } from "./Command";

export class Ping extends Command {  

    constructor() {
        super({
            name: "ping",
            aliases: [],
            permissions: [],
            description: "Show your ping!"
        });
    }

    public execute(options: CommandOptions) {
        const delay = Date.now() - Number(options.message.createdAt);
        options.message.reply(`**pong** *(delay: ${delay}ms)*`); 
    }
}