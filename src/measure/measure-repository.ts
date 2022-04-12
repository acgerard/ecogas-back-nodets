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
    v_tank: number | null,
    v_diesel: number | null,
    v_ecogas: number | null,
}


export async function createMeasure(stationId: number, measureData: {date: number, v_tank: number|null, v_diesel: number |null, v_ecogas:number|null} ): Promise<Measure> {
    const res = await query(`INSERT INTO station_measure_${stationId} (station_id, date, v_tank, v_diesel, v_ecogas) VALUES (?, FROM_UNIXTIME(?), ?, ?, ?)`, [stationId, measureData.date, measureData.v_tank, measureData.v_diesel, measureData.v_ecogas])
    if (res.affectedRows > 0) {
        return {stationId: stationId, ...measureData}
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

    let sqlQuery = `SELECT date, v_tank, v_diesel, v_ecogas FROM station_measure_${stationId} sm WHERE sm.date > FROM_UNIXTIME(?) `
    if (!!groupBy) {
        sqlQuery = sqlQuery + ` AND sm.date IN (SELECT MAX(date) from station_measure_${stationId} ${groupBy})`
    }

    return await query(sqlQuery, [startDate])
}
