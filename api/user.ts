import { serialize } from "cookie";
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { failureResponse } from '../errorHandler/response';
import { jwtMiddleware } from '../middlewares/auth';
import BearConfig from '../modules/shared/common/configs';
import EndPoint from "../modules/shared/common/endpoint";
import { UserInfo } from '../modules/shared/model/user';
import UserService from "../service/user";
import asyncHandler from '../utils/async_handle';
import { getCookieOptions } from '../utils/cookie';
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
        res.setHeader(
            'Set-Cookie',
            [
              serialize("x-access-token", userLogin.accessToken || "", { httpOnly: true, ...getCookieOptions() })
            ]
          )
        return res.json(userLogin)
    }
}));


userRouter.post("/users/me", jwtMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.getUser({
      _id: req.body.id
    })
    if (data.code !== BearConfig.LOGIN_ACCOUNT_NOT_EXIST) {
      return failureResponse( "", { data: { user: null, code: BearConfig.LOGIN_ACCOUNT_NOT_EXIST}} , res)
    }
    return res.json(data.data)
  }))



export default userRouter ;

