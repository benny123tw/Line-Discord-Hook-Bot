import * as discord from 'discord.js';
import { Command } from './Command';
import { Config } from './Config';

export class Bot {

    public config: Config;
    public client: discord.Client;
    public commands: discord.Collection<Command["name"], Command>;

    constructor(initConfig: Config) {
        this.config = initConfig;
    }

}