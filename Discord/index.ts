import * as dotenv from 'dotenv'; dotenv.config();
import { join } from 'path';
import * as fs from 'fs';
import { Bot } from './src/Bot';
const config = JSON.parse(fs.readFileSync(join(process.cwd(), 'config.json'), 'utf8'));
const { bot } = config;

bot.token = process.env[bot.token];
const mBot = new Bot(bot);
