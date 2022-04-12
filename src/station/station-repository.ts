import {query} from "../db/db";

export type Station = {
    id: number
    name?: string
}

export async function createStation(stationId: number, name?: string) {
    // add station
    await query(`INSERT INTO station (id, name) VALUES (?, ?)`, [stationId, name])
    // table for the measures of the station
    return await query(`create table if not exists station_measure_${stationId} (station_id int not null, date timestamp not null, v_tank  DOUBLE PRECISION, v_diesel DOUBLE PRECISION, v_ecogas DOUBLE PRECISION)`, [])
}

export async function createUserStation(stationId: number, userId: number): Promise<boolean> {
    // add the user station
    const res = await query(`INSERT INTO user_station (station_id, user_id) VALUES (?, ?)`, [stationId, userId])
    // true if user station added to the table
    return res.affectedRows > 0;
}

export async function deleteUserStation(stationId: number, userId: number): Promise<boolean> {
    // add the user station
    const res = await query(`DELETE FROM user_station WHERE station_id = ? AND user_id = ?`, [stationId, userId])
    // true if user station deleted to the table
    return res.affectedRows > 0;
}

export async function getUserStations(userId: number, admin: boolean): Promise<Station[]> {
    let sql = 'SELECT id, name FROM user_station JOIN station on station.id = user_station.station_id WHERE user_id=?'
    if(admin) {
        // admin, get all stations
        sql = 'SELECT id, name FROM station'
    }
    const res = await query(sql, [userId])

    if (res.length > 0) {
        return res[0]
    } else {
        return []
    }
}