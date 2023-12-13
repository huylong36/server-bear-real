import { UserInfo } from "../modules/shared/model/user";
import mongoose from 'mongoose';
import { UserModel } from "../src/database/model/users";
export default class UserService {
    registerUser = async (body: UserInfo) => {
        const {account, password} = body;
        const exitsUser = await UserModel.findOne({
            $or: [
                {account}
                
            ]

        })
        if(exitsUser) {
            let duplicateName: string[] = [];
            if(exitsUser.account === account) duplicateName.push("account");
            return {
                duplicateName,
                code: 2
            }
        }
        // create account 
        await UserModel.create(new UserInfo(body))
        return {
            code: 1
        }
    }
    saveNewUser = async (body: { userInfo: UserInfo }): Promise<UserInfo | null> => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const resUser = await new UserModel(body.userInfo).save();
            resUser.$session();
            session.commitTransaction();
            return resUser;
        } catch (err) {
            session.abortTransaction();
            return null
        } finally {
            session.endSession();
        }
    }
}