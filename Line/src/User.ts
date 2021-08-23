import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser {
    username: string;
    sourceID: string;
    notify: boolean;
}

interface IUserDocument extends IUser, Document {
}

interface IUserModel extends Model<IUserDocument> {
    findByUsername: (username: string) => Promise<IUserDocument>;
    findBySourceID: (sourceID: string) => Promise<IUserDocument>;
}

const UserSchema = new Schema<IUserDocument>({
    username: { type: String, required: true },
    sourceID: { type: String, required: true }, 
    notify: { type: Boolean, default: false },
});

UserSchema.statics.findByUsername = function (username: string) {
    return this.findOne({ username });
}

UserSchema.statics.findBySourceID = function (sourceID: string) {
    return this.findOne({ sourceID });
}

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
export default User;