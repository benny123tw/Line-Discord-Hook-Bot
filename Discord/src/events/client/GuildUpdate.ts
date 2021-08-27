import chalk = require("chalk");
import { Guild } from "discord.js";
import { Bot } from "src/Bot";
import Server from '../../models/Server';

export default async function (bot: Bot, oldGuild: Guild, newGuild: Guild) {
    // name change & icon change 
    if (oldGuild.name !== newGuild.name) {
        bot.log.info(`${oldGuild.name} change name to ${newGuild.name}`);
        await Server.findOneAndUpdate({ serverID: oldGuild.id }, { $set: { name: newGuild.name } });
    }

    if (oldGuild.icon !== newGuild.icon) {
        await Server.findOneAndUpdate({ serverID: oldGuild.id }, { $set: { icon: newGuild.iconURL() || process.env.DEFAULT_LOGO_URL } });
    }
}