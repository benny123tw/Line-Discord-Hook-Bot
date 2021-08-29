import { Command } from './Command';
import { CommandOptions } from '../Declare/Command';
import User from '../User';

export class Notify extends Command{

    constructor() {
        super(
            {
                permission: 'Free',
                name: 'notify',
                aliases: ['n', 'noti'],
                description: 'Turn off all notifiications from servers.'
            }
        );
    }

    public async execute(options: CommandOptions) {        
        const {
            args,
            sourceID,
            event,
            client,
            db
        } = options;     

        let _notify: boolean | undefined = undefined;
        switch (args[0]) {
            case '開':
            case '1':
            case 'on':
            case 't':
            case 'true':
                _notify = true;
                break;
            case '關':
            case '0':
            case 'off':
            case 'f':
            case 'false':
                _notify = false;
                break;
        }

        const curNotify = (await User.findBySourceID(sourceID)).notify;
        const response = await User.findOneAndUpdate(
            {
                sourceID: sourceID
            },
            {
                $set: {
                    notify: _notify != undefined ? _notify : !curNotify
                },
            },
            {
                new: true
            }
        );

        return new Promise((resolve, reject) => {
            if (response) 
                resolve(`通知更新成功!\n通知：${response.notify ? '開啟' : '關閉'}`);
            reject('通知更新失敗!');
        })
    }

}