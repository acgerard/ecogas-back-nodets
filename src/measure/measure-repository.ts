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
    const res = await query(`INSERT INTO station_measure_${stationId} (station_id, date, measures) VALUES (?, FROM_UNIXTIME(?), ?)`, [stationId, date, JSON.stringify(measures)])
    if (res.affectedRows > 0) {
        // TODO check RETURNING in statement to send the data inserted
        return {stationId: stationId, date: date, measures: measures}
    } else {
        throw Error('Error creating measure')
    }
}

// TODO add from/to
export async function getMeasures(stationId: number): Promise<Measure[]> {
    const res = await query(`SELECT station_id, date, measures FROM station_measure_${stationId}`, [])
    return res.map((row: any) => {
        return {stationId: row.station_id, date: row.date, measures: JSON.parse(row.measures)}
    })
}

export async function createStation(stationId: number) {
    return await query(`create table if not exists station_measure_${stationId} (station_id int not null, date timestamp not null, measures JSON not null)`, [])
}
