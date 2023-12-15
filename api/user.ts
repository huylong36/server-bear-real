import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import EndPoint from "../modules/shared/common/endpoint";
import { UserInfo } from '../modules/shared/model/user';
import UserService from "../service/user";
import asyncHandler from '../utils/async_handle';
const userRouter = express.Router();
const userService = new UserService();
dotenv.config();

userRouter.post(EndPoint.REGISTER, asyncHandler(async (req : Request, res:Response) => {
    const userInfo : UserInfo = req.body;
    if (userInfo.account) {
        const responseDb = await userService.registerUser(userInfo);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));
userRouter.post(EndPoint.LOGIN, asyncHandler(async (req : Request, res:Response) => {
    const body: { account: string, password: string } = req.body;
    if (!body.account || !body.password) {
        res.sendStatus(403)
    } else {
        const userLogin = await userService.login(body);
        return res.json(userLogin)
    }
}));



export default userRouter ;