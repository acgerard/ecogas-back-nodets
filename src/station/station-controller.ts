import {NextFunction, Request, Response} from "express";
import {
    createStation as createStationRepo,
    createUserStation as createUserStationRepo,
    deleteUserStation as deleteUserStationRepo, getUserStations
} from "../station/station-repository";
import {isAdmin, withStationId} from "../helpers/helper";
import {execute} from "../helpers/express-helper";

export async function createStation(req: Request, res: Response, next: NextFunction) {
    await withStationId(req, res, next, async (stationId: number) => {
        if (!isAdmin(req)) {
            // only admin can do that
            res.sendStatus(403)
        } else {
            try {
                await createStationRepo(stationId, req.body.name)
                res.status(201)
                res.send({id: stationId, name: req.body.name})
            } catch (e: any) {
                res.status(400)
                res.send({message: e.message})
            }
        }
    })
}


export async function createUserStation(req: Request, res: Response, next: NextFunction) {
    await withStationId(req, res, next, async (stationId: number) => {
        if (!isAdmin(req)) {
            // only admin can do that
            res.sendStatus(403)
        } else {
            const userId = Number(req.params.userId)
            if (isNaN(userId)) {
                // user ID is not a number
                res.sendStatus(400)
            } else {
                if (await createUserStationRepo(stationId, userId)) {
                    res.sendStatus(201)
                } else {
                    res.sendStatus(400)
                }
            }
        }
    })
}

export async function deleteUserStation(req: Request, res: Response, next: NextFunction) {
    await withStationId(req, res, next, async (stationId: number) => {
        if (!isAdmin(req)) {
            // only admin can do that
            res.sendStatus(403)
        } else {
            const userId = Number(req.params.userId)
            if (isNaN(userId)) {
                // user ID is not a number
                res.sendStatus(400)
            } else {
                if (await deleteUserStationRepo(stationId, userId)) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(400)
                }
            }
        }
    })
}

export async function getUserStation(req: Request, res: Response, next: NextFunction) {
    await execute(next, async () => {
        if (!!req.userId) {
            const stations = await getUserStations(req.userId, isAdmin(req))
            res.send(stations)
        } else {
            // no user id -> should never happen since authenticated
            res.send([])
        }
    })
}