import {query} from "../db/db";

export enum MeasureGranularity {
    SECOND = 'second',
    MINUTE = 'minute',
    HOUR = 'hour',
    DAY = 'day',
    MONTH = 'month',
    YEAR = 'year'
}

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

export async function getMeasures(stationId: number, granularity: MeasureGranularity, startDate: number): Promise<Measure[]> {
    let groupBy = ''
    switch (granularity) {
        case MeasureGranularity.SECOND:
            break
        case MeasureGranularity.MINUTE:
            groupBy = 'GROUP BY YEAR(date), MONTH(date), DAY(date), HOUR(date), MINUTE(date)'
            break
        case MeasureGranularity.HOUR:
            groupBy = 'GROUP BY YEAR(date), MONTH(date), DAY(date), HOUR(date)'
            break
        case MeasureGranularity.DAY:
            groupBy = 'GROUP BY YEAR(date), MONTH(date), DAY(date)'
            break
        case MeasureGranularity.MONTH:
            groupBy = 'GROUP BY YEAR(date), MONTH(date)'
            break
        case MeasureGranularity.YEAR:
            groupBy = 'GROUP BY YEAR(date)'
            break
    }

    let sqlQuery = `SELECT date, measures FROM station_measure_${stationId} sm WHERE sm.date > FROM_UNIXTIME(?) `
    if (!!groupBy) {
        sqlQuery = sqlQuery + ` AND sm.date IN (SELECT MAX(date) from station_measure_${stationId} ${groupBy})`
    }

    return await query( sqlQuery, [startDate])
}

export async function createStation(stationId: number) {
    return await query(`create table if not exists station_measure_${stationId} (station_id int not null, date timestamp not null, measures JSON not null)`, [])
}
