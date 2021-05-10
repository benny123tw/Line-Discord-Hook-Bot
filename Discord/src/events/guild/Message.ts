import { Message } from "discord.js";
import { Bot } from "src/Bot";
import { WebhookService } from "../../services/Webhook";

export default async function (bot: Bot, message: Message): Promise<any> {

    if (message.webhookID) WebhookService(bot, message);

    if (message.author.bot) return;

    if (!message.content.startsWith(bot.config.prefix)) return;

    const args = message.content.slice(bot.config.prefix.length).split(/ +/);
    const cmd = args.shift()?.toLowerCase();    

    if (cmd) bot.commands.get(cmd)?.execute({
        message: message,
        args: args,
        bot: bot,
        cmd: cmd
    });

    return message.reply("There was an error trying to execute that command!");
}