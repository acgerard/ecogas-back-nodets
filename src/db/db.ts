import { createPool } from 'mysql2'


const pool = createPool({
    connectionLimit: 5,
    host            : process.env.MYSQL_HOST || 'localhost',
    user            : process.env.MYSQL_USER || 'ecogas_admin',
    password        : process.env.MYSQL_PASSWORD || 'password',
    database        : process.env.MYSQL_DATABASE || 'ecogas',
    port        : Number(process.env.MYSQL_PORT) || 3306,
}).promise()

export async function query(
    text: string,
    params: any[],
): Promise<any> {
    const start = Date.now()
    const [rows, fields] = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', {text, duration})
    return rows
}


export async function initDB() {
    console.log('Creating user table')
    await query('create table if not exists user (email varchar(100) primary key, password varchar(512) not null)', [])
    console.log('create station_measure table')
    await query('create table if not exists station_measure (station_id int not null, date timestamp not null, measures JSON not null)', [])

}

export async function closeDB() {
    return pool.end()
}
