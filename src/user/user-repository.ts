import {query} from "../db/db";
import {NotFound} from "../helpers/error-handler";
import crypto from 'crypto'

const secret = process.env.PWD_SECRET || '97b00a76-07ed-4379-b806-9fb4e8342e37'

export type User = {
    id: number
    email: string
    name: string
    profile: UserProfile
}
export enum UserProfile {
    ADMIN= 'ADMIN',
    STATION = 'STATION',
    CUSTOMER = 'CUSTOMER'
}

export async function isUser(email: string) {
    // query the DB
    const res = await query('SELECT email FROM user WHERE email=?', [email])

    return res.length > 0
}

export async function getUser(email: string, password: string): Promise<User> {
    // get pass hashed
    const hashedPwd = getHashedPwd(password)

    // query the DB
    const res = await query('SELECT id, email, name, profile FROM user WHERE email=? and password=?', [email, hashedPwd])

    if (res.length > 0) {
        return res[0]
    } else {
        throw new NotFound('user', email)
    }
}

export async function getAllUsers(): Promise<({ stations: number[] } & User)[]> {
    // query the DB
    const results = await query('SELECT id, email, name, profile, station_id FROM user LEFT JOIN user_station ON user_station.user_id = user.id', [])
    const usersById: { [id: number]: { stations: number[] } & User } = {}
    results.map((res: { id: number, email: string, name: string, profile: UserProfile, station_id?: number }) => {
        if (!usersById[res.id]) {
            usersById[res.id] = {id: res.id, email: res.email, name: res.name, profile: res.profile, stations: []}
        }
        if(!!res.station_id) {
            usersById[res.id].stations.push(res.station_id)
        }
    })
    return Object.values(usersById)
}

export async function updateUser({id, email, name, password, profile}:{id: number, email?: string, name?: string, password?: string, profile?: string}) {
    if(!!password) {
        const hashedPwd = getHashedPwd(password)
        await query('UPDATE user SET password=? WHERE id=?', [hashedPwd, id])
    }
    if(!!email) {
        await query('UPDATE user SET email=? WHERE id=?', [email, id])
    }
    if(!!name) {
        await query('UPDATE user SET name=? WHERE id=?', [name, id])
    }
    if(!!profile) {
        await query('UPDATE user SET profile=? WHERE id=?', [profile, id])
    }

    const res = await query('SELECT id, email, name, profile FROM user WHERE id=?', [id])

    if (res.length > 0) {
        return res[0]
    } else {
        throw new NotFound('user', id.toString())
    }
}

export async function resetPassword(email: string) {
    const password = randomPassword(12)
    const hashedPwd = getHashedPwd(password)
    const res = await query('UPDATE user SET password=? WHERE email=?', [hashedPwd, email])
    if (res.length <= 0) {
        throw new NotFound('user', email)
    } else {
        return password
    }
}

export async function createUser(email: string, name?: string, password?: string) {
    const pwd = password || randomPassword(12)
    const hashedPwd = getHashedPwd(pwd)
    const res = await query('INSERT INTO user (email, name, password) VALUES (?, ?, ?)', [email, name, hashedPwd])
    if (res.length <= 0) {
        throw Error('Error creating user ' + email)
    } else {
        return getUser(email, pwd)
    }
}

function getHashedPwd(password: string) {
    return crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex')
}

function randomPassword(length: number) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result;
}