import express ,{Request,Response}from 'express';
import EndPoint from "../modules/shared/common/endpoint";
import { UserInfo } from '../modules/shared/model/user';
import UserService from "../service/user";
import asyncHandler from '../utils/async_handle';
const userRouter = express.Router();
const userService = new UserService();

userRouter.post(EndPoint.REGISTER, asyncHandler(async (req, res) => {
    

    const body: { userInfo: UserInfo } = req.body;
    if (!body.userInfo) {
        const responseDb = await userService.registerUser(body.userInfo);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));


userRouter.post("/c", (req:Request, res:Response) => {
    console.log("xxxxx");
    
    const body: { userInfo: UserInfo } = req.body;
    return  res.sendStatus(200); 
});

export default userRouter ;