import { Bot } from "src/Bot";
import { Notify } from "./Notify";
import { Ping } from "./Ping";

export function Commands (bot: Bot): void {
    bot.commands.set('ping', new Ping());
    bot.commands.set('notify', new Notify());
}