import EndPoint from "../modules/shared/common/endpoint";
import { UserInfo } from "../modules/shared/model/user";
import UserService from "../service/user";
import asyncHandler from '../utils/async_handle';
import express from 'express';
const userRouter = express.Router();
const userService = new UserService();

userRouter.post(EndPoint.REGISTER, asyncHandler(async (req, res) => {
    const body: { UserInfo } = req.body;
    if (!body) {
        const responseDb = await userService.registerUser(body);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));