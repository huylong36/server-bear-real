import { Response } from 'express'
export function failureResponse(message: string, data: any, res: Response) {
    res.status(200).send({
        status: 1,
        message,
        data
    });
}