import {NextFunction, Request, Response} from "express";
import {execute} from "./express-helper";

export async function withStationId(req: Request, res: Response, next: NextFunction, callback: (stationId: number) => void) {
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



export function isAdmin(req: Request) {
    return req.profile === UserProfile.ADMIN
}
export function isStation(req: Request) {
    return req.profile === UserProfile.STATION
}