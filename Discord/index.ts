import * as dotenv from 'dotenv'; dotenv.config();
import { join } from 'path';
import * as fs from 'fs';
import { Bot } from './src/Bot';
import express, { Application, Request, Response } from 'express';

const config = JSON.parse(fs.readFileSync(join(process.cwd(), 'config.json'), 'utf8'));
const { bot } = config;

bot.token = process.env[bot.token];
const mBot = new Bot(bot);


// for heroku wake up
// To Do: using line text to the bot and make it connect to the port
// and make this app up
const PORT = process.env.PORT || 3000;
const app: Application = express();

app.get(
    '/',
    async (_: Request, res: Response): Promise<Response> => {
        return res.status(200).json({
          status: 'success',
          message: 'Connected successfully!',
        });
      }
);

app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
});
  