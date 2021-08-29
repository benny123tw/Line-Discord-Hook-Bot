import { WebhookEvent, Client } from "@line/bot-sdk";
import { MongoDB } from "../MongoDB";

type membership = 'Free' | 'Premium';

export declare interface CommandConfig {
    name: string;
    aliases: string[];
    description: string;
    permission: membership;
}

export declare interface CommandOptions {
    args: string[];
    sourceID: string;
    userInfo: any;
    event: WebhookEvent;
    client: Client;
    db: MongoDB;
}
