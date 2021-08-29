import { response } from 'express';
import { connect, model, Document, Schema, Model } from 'mongoose';
import User, { IUserDocument } from './User';
import Server from './Server';

export class MongoDB {

    constructor() {
        this.setUp();
    }

    private async setUp() {
        if (!process.env.MONGODB_SRV) {
            return new Error('url is not specified!');
        }

        const result = await connect(process.env.MONGODB_SRV, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        if (result) console.log(`Connected to the Database!`);
    }

    public async findOrCreate(options: dbOptions): Promise<IUserDocument> {
        const {
            username,
            sourceID
        } = options;
        return new Promise(async (resolve, reject) => {

            const data = await User.findBySourceID(sourceID);
            if (data) return resolve(data);
    
            const userDB = await User.create({
                "sourceID": sourceID,
                "username": username
            });
            userDB.save();

            if (userDB) {
                console.log("User data saved to the Database successfully!");
                resolve(userDB);
            }                

            reject('Something went wrong on creating user data.');
        });
    }

    public async subscribe(sourceID: string, guildID: string) {
        const data = await Server.findByServerID( guildID );

        const response = await User.findOneAndUpdate(
            {
                sourceID: sourceID
            },
            {
                $set: {
                    notify: true
                },
                $push: {
                    guilds: data._id
                }
            },
            {
                new: true
            }
        );

        return new Promise((resolve, reject) => {
            if (response) 
                resolve(`update action done.`);
            reject('Cannot update the data!');
        })
    }

    public async unsubscribe(sourceID: string, guildID: string) {
        const data = await Server.findByServerID( guildID );

        const response = await User.findOneAndUpdate(
            {
                sourceID: sourceID
            },
            {
                $set: {
                    notify: false
                }, 
                $pull: {
                    guilds: data._id
                }
            },
            {
                new: true
            }
        );

        return new Promise((resolve, reject) => {
            if (response) 
                resolve(`update action done.`);
            reject('Cannot update the data!');
        })
    }
}

export interface dbOptions {
    username: string;
    sourceID: string;
}



