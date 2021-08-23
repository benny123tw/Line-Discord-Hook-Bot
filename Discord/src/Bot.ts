import * as discord from 'discord.js';
import { Command } from './commands/Command';
import { Commands } from './commands/index';
import { BotConfig } from './Config';
// import { Handlers } from './handlers';
import { Events } from './events/Events';
import { Log } from './Log';

import { connect } from 'mongoose';
import * as dotenv from 'dotenv';import chalk = require('chalk');
 dotenv.config();

export class Bot {

    public config: BotConfig;
    public client: discord.Client;
    public commands: discord.Collection<Command["name"], Command>;
    public log: Log;

    constructor(initConfig: BotConfig) {
        this.config = initConfig;
        this.log = new Log(this.config.tag);
        this.commands = new discord.Collection();
        const intents = new discord.Intents([
            discord.Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
            "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
        ]);
        this.client = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], ws: { intents } });
        this.load();
        this.connectToDB();
    }

    private load(): void {
        this.loadCommands();

        this.log.info(`Connecting...`);
        this.client.login(this.config.token);
    }

    private loadCommands(): void {
        this.log.info(`Loading commands...`);
        this.addEvents();

        Commands(this);
    }

    private addEvents(): void {
        new Events(this);
    } 

    private async connectToDB(): Promise<void> {
        if (!process.env.MONGODB_SRV) return;
        
        const result = await connect(process.env.MONGODB_SRV, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        
        if (result) this.log.info(chalk.green`Connected to the Database!`);
    }

}