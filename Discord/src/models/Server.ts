import { model, Schema, Document, Model } from 'mongoose';
import { Guild } from 'discord.js';

export interface IServer {
    name: string;
    serverID: string;
    icon: string;
    prefix: string;
}

interface IServerDocument extends IServer, Document {
}

interface IServerModel extends Model<IServerDocument> {
    findByName: (name: string) => Promise<IServerDocument>;
    findByServerID: (serverID: string) => Promise<IServerDocument>;
}

export const ServerSchema = new Schema<IServerDocument>({
    name: { type: String, default: process.env.ASSETS_URL + 'server-logo.png' },
    serverID: { type: String, required: true }, 
    icon: { type: String, required: true }, 
    prefix: { type: String, default: 'l!' },
});

ServerSchema.statics.findByName = function (name: string) {
    return this.findOne({ name });
}

ServerSchema.statics.findByServerID = function (serverID: string) {
    return this.findOne({ serverID });
}

const Server = model<IServerDocument, IServerModel>('Server', ServerSchema);
export default Server;