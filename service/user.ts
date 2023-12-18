import bycrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import BearConfig from "../modules/shared/common/configs";
import { UserInfo } from "../modules/shared/model/user";
import { UserModel } from "../src/database/model/users";
dotenv.config();
export default class UserService {
    registerUser = async (body: { account: string, password: string }) => {
        const exitsUser = await UserModel.findOne({ account: body.account });
        let loginCode = BearConfig.REGISTER_FAILED;
        if (exitsUser) {
            let duplicateName: string[] = [];
            if (exitsUser.account === body.account) duplicateName.push("account");
            return {
                duplicateName,
                loginCode: BearConfig.REGISTER_ACCOUNT_IS_USED
            }
        }
        const salt = await bycrypt.genSalt(10);
        body.password = await bycrypt.hash(body.password, salt);
        const userInfo = await UserModel.create(body);
        const accessToken = jwt.sign({ userId: userInfo?._id }, salt);
        loginCode = BearConfig.REGISTER_SUCCESS
        return {loginCode ,accessToken}
    }
    login = async (body: { account: string, password: string }) => {
        let userInfo = new UserInfo({ ...body });
        let checkUserAcc: UserInfo | null = await UserModel.findOne({ account: userInfo.account });
        if (checkUserAcc !== null) {
            let newPass = await bycrypt.compare(body.password, checkUserAcc.password);
            let loginCode = BearConfig.LOGIN_FAILED;
            if (newPass) {
                const salt = await bycrypt.genSalt(10);
                userInfo = new UserInfo(checkUserAcc);
                const accessToken = jwt.sign({ userId: userInfo?._id }, salt);
                loginCode = BearConfig.LOGIN_SUCCESS;
                return { userInfo, loginCode, accessToken };
            }
            return { loginCode: BearConfig.LOGIN_WRONG_PASSWORD };
        }
        return { loginCode: BearConfig.LOGIN_ACCOUNT_NOT_EXIST };
    }
}