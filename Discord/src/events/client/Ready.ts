import chalk = require("chalk");
import { Bot } from "src/Bot";
import Server from '../../models/Server';

export default function (bot: Bot) {
    bot.log.info(`Bot Version: ${chalk.yellowBright(process.env.npm_package_version)}`)
    bot.log.info(chalk.cyan(`Logged in as: ${bot.client.user?.tag} (id: ${bot.client.user?.id})`));

    bot.client.guilds.cache.forEach(async guild => {
        const exists = await Server.exists({ name: guild.name });
        if (!exists) {
            await Server.create(
                {
                    name: guild.name,
                    serverID: guild.id,
                    icon: guild.iconURL() || process.env.ASSETS_URL + 'server-logo.jpg'
                }
            )
        }        
    });
}