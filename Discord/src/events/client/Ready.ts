import chalk = require("chalk");
import { Bot } from "src/Bot";

export default function (bot: Bot) {
    bot.log.info(chalk.cyan(`Logged in as: ${bot.client.user?.tag} (id: ${bot.client.user?.id})`))
}