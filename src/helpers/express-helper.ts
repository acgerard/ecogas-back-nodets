import {NextFunction} from "express";

export async function execute(next: NextFunction, callback: () => void) {
    try {
        await callback()
    } catch (e: any) {
        next(e)
    }
}