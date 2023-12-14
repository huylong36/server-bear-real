import bycrypt from 'bcrypt';
import dotenv from 'dotenv';
import BearConfig from "../modules/shared/common/configs";
import { UserInfo } from "../modules/shared/model/user";
import { UserModel } from "../src/database/model/users";
dotenv.config();
export default class UserService {
    registerUser = async (body: UserInfo) => {
        const exitsUser = await UserModel.findOne({ account: body.account });
        if (exitsUser) {
            let duplicateName: string[] = [];
            if (exitsUser.account === body.account) duplicateName.push("account");
            return {
                duplicateName,
                code: BearConfig.REGISTER_ACCOUNT_IS_USED
            }
        }
        const salt = await bycrypt.genSalt(10);
        body.password = await bycrypt.hash(body.password, salt);
        let checkUserAcc: UserInfo | null = await UserModel.findOne({ account: body.account });
        if (checkUserAcc) {
            return BearConfig.REGISTER_ACCOUNT_IS_USED;
        } else {
            await UserModel.create(body);
            return BearConfig.REGISTER_SUCCESS;
        }
    }
    login = async (body: { account: string, password: string }): Promise<UserInfo> => {
        let userInfo = new UserInfo({ ...body });
        let checkUserAcc: UserInfo | null = await UserModel.findOne({ account: userInfo.account });
        if (checkUserAcc !== null) {
            let newPass = await bycrypt.compare(body.password, checkUserAcc.password);
            if (newPass) {
                if (checkUserAcc) {
                    userInfo = new UserInfo(checkUserAcc);
                    userInfo.loginCode = BearConfig.LOGIN_SUCCESS;
                } else {
                    userInfo.loginCode = BearConfig.LOGIN_ACCOUNT_NOT_EXIST;
                }
            }else{
                userInfo.loginCode = BearConfig.LOGIN_WRONG_PASSWORD;
            }
        }
        return userInfo;
    }
}