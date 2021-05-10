import chalk = require("chalk");
import { Bot } from "src/Bot";

export default function (bot: Bot, error: Error) {
    bot.log.error(chalk.red(`Client error: ${error.message}`));
}