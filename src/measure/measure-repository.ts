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
    const res = await query('INSERT INTO station_measure (station_id, date, measures) VALUES (?, ?, ?)', [stationId, date, JSON.stringify(measures)])
    if (res.affectedRows > 0) {
        // TODO check RETURNING in statement to send the data inserted
        return {stationId: stationId, date: date, measures: measures}
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
