import { Router } from 'express';
import userRouter  from '../api/user';
const router = Router();

router.use(userRouter);
export {router as webRouter };