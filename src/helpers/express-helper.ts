import {NextFunction} from "express";

export async function execute(next: NextFunction, callback: () => void) {
    try {
        return await callback()
    } catch (e: any) {
        console.log("ERROR!!!")
        next(e)
    }
}