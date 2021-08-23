import { WebhookEvent } from "@line/bot-sdk";
import { MongoDB } from "../MongoDB";

export declare interface CommandConfig {
    name: string;
    aliases: string[];
    description: string;
}

export declare interface CommandOptions {
    message: string;
    args: string[];
    cmd: string;
    event: WebhookEvent;
    db: MongoDB;
}
