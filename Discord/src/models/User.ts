import mongoose, { Schema, Document, Model } from "mongoose";
import Server, { IServer, ServerSchema } from "./Server";

export interface IUser {
    guilds: IServer[];
    username: string;
    sourceID: string;
    notify: boolean;
}

interface IUserDocument extends IUser, Document {
}

interface IUserModel extends Model<IUserDocument> {
    findByGuildID: (guild: string) => Promise<IUserDocument>;
    findByUsername: (username: string) => Promise<IUserDocument>;
    findBySourceID: (sourceID: string) => Promise<IUserDocument>;
}

const UserSchema = new Schema<IUserDocument>({
    guilds: [{ type: Schema.Types.ObjectId, ref: 'Server' }],
    username: { type: String, required: true },
    sourceID: { type: String, required: true },
    notify: { type: Boolean, default: false },
});

UserSchema.statics.findByGuildName = function (name: string) {
    return this.findOne({ 'guilds.name': name });
}

UserSchema.statics.findByUsername = function (username: string) {
    return this.findOne({ username });
}

UserSchema.statics.findBySourceID = function (sourceID: string) {
    return this.findOne({ sourceID });
}

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
export default User;