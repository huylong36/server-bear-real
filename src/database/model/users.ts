import mongoose, { Document, Model , model } from "mongoose";
import { UserInfo } from "../../../modules/shared/model/user";
export const userTableName = "User";
export interface IUserInfo extends Model<UserDoc>{

}
export interface UserDoc extends UserInfo, Document {
    _id: string;
}
const UserInfoSchema = new mongoose.Schema<UserDoc, IUserInfo>(
    {
        account: String,
        name: String,
        loginCode :{type:Number, default: -1},
        password:String,
        address:String,
        email:String,
    },
    {
        timestamps:true
    }
)

export const UserModel = model(userTableName, UserInfoSchema);