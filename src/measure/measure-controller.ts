import {NextFunction, Request, Response} from "express";
import {createMeasure, getMeasures} from "./measure-repository";
import {execute} from "../helpers/express-helper";


export async function create(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const stationId = Number(req.params.id)
        if(isNaN(stationId)) {
            // station ID is not a number
            res.status(400)
        } else {
            const result = await createMeasure(stationId, req.body)
            res.status(201)
            res.send(result)
        }
    })
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        const result = await getMeasures()
        res.send(result)
    })
}
