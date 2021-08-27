// Import all dependencies, mostly using destructuring for better view.
import { ClientConfig, Client, middleware, MiddlewareConfig, WebhookEvent, TextMessage, MessageAPIResponseBase } from '@line/bot-sdk';
import express, { Application, Request, Response } from 'express';
import * as axios from 'axios';
import Message from './src/Message';
import { Commands } from './src/Commands/index';

import { MongoDB } from './src/MongoDB';

// Setup all LINE client and Express configurations.
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET,
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const PORT = process.env.PORT || 3000;

// Create a new LINE SDK client.
const client = new Client(clientConfig);

// Create a new Express application.
const app: Application = express();

// Function handler to receive the text.
const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
  // Process all variables here.
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  // Process all message related variables here.
  const { replyToken } = event;
  const { text } = event.message;

  // Create a new message.
  const response: TextMessage = {
    type: 'text',
    text: text,
  };

  const { data } = await axios.default.get('https://api.line.me/v2/bot/profile/' + event.source.userId,  {
    headers: {
        'Content-Type': 'application/json',
        Authorization:
            'Bearer {' + clientConfig.channelAccessToken + '}',
    },
})

  const message = {
    username: "Line",
    avatar_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/LINE_New_App_Icon_%282020-12%29.png/600px-LINE_New_App_Icon_%282020-12%29.png",

    embeds: [
      {
        description: text,
        color: '4500819', // Hexdecimal
        author: {
          name: data.displayName,
          icon_url: data.pictureUrl
        },
        footer: {
          text: "Copyright ©️ 2021 Line&Discord Hook Bot."
        }

      }
    ],
  }

  // if (event.source.userId === process.env.OWNER_ID)
  axios.default.post(process.env.DISCORD_CHANNEL_URL
  , message, { headers: {"Content-Type": 'application/json'}});

  // Reply to the user.
  await client.replyMessage(replyToken, response);
};

const database = new MongoDB();
Commands(); // Loading commands;

// Register the LINE middleware.
// As an alternative, you could also pass the middleware in the route handler, which is what is used here.
// app.use(middleware(middlewareConfig));

// Route handler to receive webhook events.
// This route is used to receive connection tests.
app.use(express.static('public'));

app.get(
  '/',
  async (_: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      status: 'success',
      message: 'Connected successfully!',
    });
  }
);

// This route is used for the Webhook.
app.post(
  '/webhook',
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    const events: WebhookEvent[] = req.body.events;

    // Process all of the received events asynchronously.
    const results = await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await Message(event, client, database);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }

          // Return an error message.
          return res.status(500).json({
            status: 'error',
          });
        }
      })
    );

    // Return a successfull message.
    return res.status(200).json({
      status: 'success',
      results,
    });
  }
);

// Create a server and listen to it.
app.listen(PORT, () => {
  console.log(`Application is live and listening on port ${PORT}`);
});
