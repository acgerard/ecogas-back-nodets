import {NextFunction, Request, Response} from "express";
import {createMeasure, createStation as createStationRepo, getMeasures, MeasureGranularity} from "./measure-repository";
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
        const queryParams = Object.keys(req.query)
        if(!queryParams.includes('startdate')) {
            res.status(400)
            res.send({message: 'startDate query param is mandatory'})
            return
        } else if(!queryParams.includes('granularity')) {
            res.status(400)
            res.send({message: 'granularity query param is mandatory'})
            return
        }

        const startDate = Number(req.query.startdate)
        if(Number.isNaN(startDate)) {
            res.status(400)
            res.send({message: 'startDate query param should be a number (timestamp)'})
            return
        }

        let granularityStr = (req.query.granularity as string).toUpperCase()
        if(!Object.keys(MeasureGranularity).includes(granularityStr)) {
            res.status(400)
            res.send({message: `MeasureGranularity query param should be one of ${Object.keys(MeasureGranularity)}`})
            return
        }

        const granularity = (<any>MeasureGranularity)[granularityStr]

        const result = await getMeasures(stationId, granularity, startDate)
        res.send(result)
    })
}

export async function createStation(req: Request, res: Response, next: NextFunction) {
    await withStationId(req, res, next, async (stationId: number) => {
        await createStationRepo(stationId)
        res.sendStatus(201)
    })
}
