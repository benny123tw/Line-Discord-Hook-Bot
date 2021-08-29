import * as axios from 'axios';
import { GuildMember, VoiceState } from 'discord.js';
import { CommandConfig, CommandOptions, permissions } from "src/Command";
import User from '../models/User';
import { Command } from "./Command";

export class Notify extends Command {  

    constructor() {
        super({
            name: "notify",
            aliases: ['no'],
            permissions: [],
            description: "Push notification to Line."
        });
    }

    public async execute(options: CommandOptions) {
        const {
            message,
            args,
            cmd,
            bot,
        } = options;

        if ( !message.member || !message.member.voice ) return message.reply('Please join in a voice channel to execute this command.');
        const member = message.member;
        const voiceState = message.member.voice;
        const userArr = await User.find().populate({
            path: 'guilds',
            match: { serverID: { $eq: voiceState.guild.id } }
        });
        
        const subscribers = userArr.filter(user => user.guilds.length);
    
        const result = subscribers.every(async (c, i) => {
            return await pushMessage(member, c.sourceID, voiceState);
        });

        if (result)
            return message.reply('訊息推播成功!');
        
        return message.reply('訊息發送錯誤!');
    }
}

async function pushMessage(member: GuildMember, sourceID: string, voiceState: VoiceState) {
    const invite = await createInvite(voiceState);
    axios.default({
        method: 'post',
        url: 'https://api.line.me/v2/bot/message/push',
        data: {
            "to": sourceID,
            "messages": [
                {
                    "type": "text",
                    "text": `${ member.nickname ? member.user.username : member.nickname } 邀請你加入語音頻道${ voiceState.channel?.name }\n${invite}`
                }
            ]
        },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer {${process.env.CHANNEL_ACCESS_TOKEN}}`
        }
    }).then(response => {
        console.log(`Notification push successfully!`);
        return true;
    }).catch(error => {
        console.log(error);
        return false;
    });
}

async function createInvite(voiceState: VoiceState) {
    let invite = await voiceState.channel?.createInvite(
        {
            maxAge: 0, // maximum time for the invite, in milliseconds
            maxUses: 0, //maximum times it can be used 
            reason: 'Auto notify ppl to join this channel!'
        }
    ).catch(console.log)

    return invite ? invite : undefined;
}