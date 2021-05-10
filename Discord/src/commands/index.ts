import { Bot } from "src/Bot";
import { Ping } from "./Ping";

export function Commands (bot: Bot): void {
    bot.commands.set('ping', new Ping());
}