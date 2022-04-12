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
    console.log('executed query', {text, duration, params})
    return rows
}


export async function initDB() {
    console.log('Creating user table')
    await query("create table if not exists user (id serial primary key, email varchar(100) unique, name varchar(100), password varchar(512) not null, profile varchar(20) not null default 'CUSTOMER')", [])
    console.log('Creating station table')
    await query('create table if not exists station (id int primary key, name varchar(100))', [])
    console.log('Creating user_station table')
    await query('' +
        'create table if not exists user_station (user_id bigint unsigned, station_id int, ' +
        'foreign key user_id (user_id) references user(id), ' +
        'foreign key station_id (station_id) references station(id)' +
        ')'
        , [])


}

export async function closeDB() {
    return pool.end()
}
