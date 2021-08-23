import { response } from 'express';
import { connect, model, Document, Schema, Model } from 'mongoose';
import User from './User';

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

    public async exsist(sourceID: string): Promise<boolean> {
        console.log(`test ${sourceID} exsist`);
        const data = await User.findBySourceID(sourceID);
        console.log(`find the database action done.`);
        if (data) return true;

        return false;
    }

    public async createDB(sourceID: string, username: string) {
        console.log(`try to create ${sourceID}\'s database`);
        if (await this.exsist(sourceID)) return "User Exsist.";
        console.log(`check action done.`)

        const userDB = await User.create({
            "sourceID": sourceID,
            "username": username
        });
        userDB.save();
        console.log(`save action done.`)

        return new Promise((resolve, reject) => {
            if (userDB) {
                console.log("User data saved to the Database successfully!");
                resolve(userDB);
            }                

            reject('Something went wrong on creating user data.');
        });
    }

    public async subscribe(sourceID: string) {
        const response = await User.findOneAndUpdate(
            {
                sourceID: sourceID
            },
            {
                $set: {
                    notify: true
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

    public async unsubscribe(sourceID: string) {
        const response = await User.findOneAndUpdate(
            {
                sourceID: sourceID
            },
            {
                $set: {
                    notify: false
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




