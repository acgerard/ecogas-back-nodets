import {NextFunction, Request, Response} from "express";
import {execute} from "./express-helper";
import {UserProfile} from "../user/user-repository";

export async function withStationId(req: Request, res: Response, next: NextFunction, callback: (stationId: number) => void) {
    await execute(next, async () => {
        const stationId = Number(req.params.id)
        if (isNaN(stationId)) {
            // station ID is not a number
            res.status(400)
        } else {
            return callback(stationId)
        }
    })
}



export function isAdmin(req: Request) {
    return req.profile === UserProfile.ADMIN
}
export function isStation(req: Request) {
    return req.profile === UserProfile.STATION
}