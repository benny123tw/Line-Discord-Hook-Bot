import chalk = require("chalk");
import { VoiceState, VoiceChannel } from 'discord.js';
import { Bot } from 'src/Bot';
import * as axios from 'axios';
import User from '../../models/User';

type Action = 'none' | 'join' | 'leave' | 'switch';

type UserStatus = {
    serverName: String;
    name: String | undefined | null;
    channelName: String | undefined | null;
    action: Action;
}

export default async function (bot: Bot, oldState: VoiceState, newState: VoiceState) {
    let user: String | undefined | null;
    let channel: VoiceChannel | undefined | null;
    let userStatus: UserStatus = {
        serverName: '',
        name: '',
        channelName: '',
        action: 'none'
    }
    
    userStatus.serverName = oldState.guild.name;

    user = oldState ?
        oldState?.member?.nickname ?
            oldState?.member?.nickname : oldState?.member?.user.username
        : newState?.member?.nickname ?
            newState?.member?.nickname : newState?.member?.user.username;

    const userColor = chalk.yellowBright(user);
    userStatus.name = user;


    if (oldState.channelID === newState.channelID) {
        channel = newState?.channel;
        console.log(channel?.name);
        bot.log.info(`${userColor} has not moved!`);
        userStatus.action = 'none';
    }
    if (oldState.channelID && newState.channelID && newState.channelID != oldState.channelID) {
        channel = newState?.channel;
        console.log(channel?.name);
        bot.log.info(`${userColor} switched channels!`);
        userStatus.action = 'switch';
    }
    if (!oldState.channelID) {
        channel = newState?.channel;
        console.log(channel?.name);
        bot.log.info(`${userColor} joined a channel!`);
        userStatus.action = 'join';
    }
    if (!newState.channelID) {
        channel = oldState?.channel;
        console.log(channel?.name);
        bot.log.info(`${userColor} left!!`);
        userStatus.action = 'leave';
    }

    userStatus.channelName = channel?.name;
    
    const userArr = await User.find().populate({
        path: 'guilds',
        match: { serverID: { $eq: newState.guild.id } }
    });
    
    const result = userArr.filter(user => user.guilds.length);

    result.forEach((c, i) => {
        pushMessage(c.sourceID, userStatus, newState);
    });
}

async function pushMessage(sourceID: string, userStatus: UserStatus, newState: VoiceState) {
    const invite = await createInvite(newState);
    axios.default({
        method: 'post',
        url: 'https://api.line.me/v2/bot/message/push',
        data: {
            "to": sourceID,
            "messages": [
                {
                    "type": "text",
                    "text": `[${userStatus.serverName}] ${userStatus.name} ${userStatus.action === 'switch' ? `${userStatus.action} to` : userStatus.action} channel 「${userStatus.channelName}」\n${userStatus.action != 'leave' ? `Come to join us!\n${invite}` : ''}`
                }
            ]
        },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer {${process.env.CHANNEL_ACCESS_TOKEN}}`
        }
    }).then(response => {
        console.log(`Notification push successfully!`)
    }).catch(error => {
        console.log(error)
    });
}

async function createInvite(newState: VoiceState) {
    let invite = await newState.channel?.createInvite(
        {
            maxAge: 0, // maximum time for the invite, in milliseconds
            maxUses: 0, //maximum times it can be used 
            reason: 'Auto notify ppl to join this channel!'
        }
    ).catch(console.log)

    return invite ? invite : undefined;
}