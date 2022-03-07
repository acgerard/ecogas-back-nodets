import {NextFunction, Request, Response} from "express";
import {createMeasure, createStation as createStationRepo, getMeasures} from "./measure-repository";
import {execute} from "../helpers/express-helper";

async function withStationId(req: Request, res: Response, next: NextFunction, callback: (stationId: number) => void) {
    await execute(next, async () => {
        const stationId = Number(req.params.id)
        if (isNaN(stationId)) {
            // station ID is not a number
            res.status(400)
        } else {
            callback(stationId)
        }
    })
}

export async function create(req: Request, res: Response, next: NextFunction) {
    await withStationId(req, res, next, async (stationId) => {
        const result = await createMeasure(stationId, req.body)
        res.status(201)
        res.send(result)
    })

}

export async function getAll(req: Request, res: Response, next: NextFunction) {
    await withStationId(req, res, next, async (stationId: number) => {
        // TODO from / to in query params
        const result = await getMeasures(stationId)
        res.send(result)
    })
}

export async function createStation(req: Request, res: Response, next: NextFunction) {
    await withStationId(req, res, next, async (stationId: number) => {
        await createStationRepo(stationId)
        res.sendStatus(201)
    })
}
