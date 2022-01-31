import {NextFunction, Request, Response} from "express";
import {execute} from "../helpers/express-helper";
import {getUser, updatePassword, resetPassword as resetPasswordDb, createUser} from "./user-repository";


export async function authenticate(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getUser(req.body.email, req.body.password)
        res.send(result)
    })
}

export async function update(req: Request, res: Response, next: NextFunction) {
    if (req.user === req.params.email) {
        await execute(next, async () => {
            const result = await updatePassword(req.params.email, req.body.password)
            res.send(result)
        })
    } else throw 'You can only update your own password'
}

export async function create(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await createUser(req.body.email, req.body.password)
        res.send(result)
    })
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await resetPasswordDb(req.params.email)
        res.send({password: result})
    })
}