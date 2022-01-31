import {query} from "../db/db";

export type Measure = {
    stationId: number,
    date: number,
    measures: any,
}

// flowDiesel: number,
// flowEcogas: number,
// temperature: number,
// tankVolume: number


export async function createMeasure(stationId: number, measureData: any): Promise<Measure> {
    const {date, ...measures} = measureData
    const res = await query('INSERT INTO station_measure (station_id, date, measures) VALUES (?, ?, ?) RETURNING station_id, date, measures', [stationId, date, measures])
    if (res.rowCount > 0) {
        const result = res[0]
        return {stationId: result.station_id, date: result.date, measures: result.measures}
    } else {
        throw Error('Error creating measure')
    }
}

export async function getMeasures(): Promise<Measure[]> {
    const res = await query('SELECT station_id, date, measures FROM station_measure', [])
    return res.map((row: any) => {
        return {stationId: row.station_id, date: row.date, measures: row.measures}
    })
}
