import chalk = require("chalk");
import { ClientEvents } from "discord.js";
import { Bot } from "src/Bot";

export default function (bot: Bot, event: CloseEvent): void {
    bot.log.warn(chalk.yellow(`Disconnected: ${event.reason} (${event.code})`));
}