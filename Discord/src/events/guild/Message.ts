import { Message } from "discord.js";
import { Bot } from "src/Bot";
import Server from "../../../src/models/Server";
import { WebhookService } from "../../services/Webhook";

export default async function (bot: Bot, message: Message): Promise<any> {

    if (message.webhookID) WebhookService(bot, message);

    if (message.author.bot) return;

    if (!message.guild) return message.reply('Please join a voice channel.');

    const _prefix = (await Server.findByServerID(message.guild.id)).prefix;

    if (!message.content.startsWith(_prefix)) return;

    const args = message.content.slice(bot.config.prefix.length).split(/ +/);
    const cmd = args.shift()?.toLowerCase();    

    if (cmd) {
        bot.commands.get(cmd)?.execute({
            message: message,
            args: args,
            bot: bot,
            cmd: cmd
        });
        return;
    }

    return message.reply("There was an error trying to execute that command!");
}