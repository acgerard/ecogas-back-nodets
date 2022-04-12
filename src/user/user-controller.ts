import {NextFunction, Request, Response} from "express";
import {execute} from "../helpers/express-helper";
import {getUser, updatePassword, resetPassword as resetPasswordDb, createUser, getAllUsers} from "./user-repository";
import {isAdmin} from "../helpers/helper";


export async function authenticate(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getUser(req.body.email, req.body.password)
        res.send(result)
    })
}

export async function update(req: Request, res: Response, next: NextFunction) {
    if (req.userId === Number(req.params.id)) {
        await execute(next, async () => {
            const result = await updatePassword(req.params.email, req.body.password)
            res.send(result)
        })
    } else throw 'You can only update your own password'
}

export async function create(req: Request, res: Response, next: NextFunction) {
    if (!isAdmin(req)) {
        // only admin can do that
        res.sendStatus(403)
    } else {
        await execute(next, async () => {
            const result = await createUser(req.body.email, req.body.name, req.body.password)
            res.send(result)
        })
    }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        if (!isAdmin(req)) {
            // only admin can do that
            res.sendStatus(403)
        } else {
            const result = await resetPasswordDb(req.params.email)
            res.send({password: result})
        }
    })
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        if (!isAdmin(req)) {
            // only admin can do that
            res.sendStatus(403)
        } else {
            const result = await getAllUsers()
            res.send(result)
        }
    })
}
