import {query} from "../db/db";
import {NotFound} from "../helpers/error-handler";
import crypto from 'crypto'


const secret = '97b00a76-07ed-4379-b806-9fb4e8342e37'

export async function isUser(login: string) {
    // query the DB
    const res = await query('SELECT email FROM user WHERE email=?', [login])

    return res.length > 0
}

export async function getUser(login: string, password: string) {
    // get pass hashed
    const hashedPwd = getHashedPwd(password)

    // query the DB
    const res = await query('SELECT email FROM user WHERE email=? and password=?', [login, hashedPwd])

    if (res.rowCount > 0) {
        return res[0].email
    } else {
        throw new NotFound('user', login)
    }
}

export async function updatePassword(login: string, newPassword: string) {
    const hashedPwd = getHashedPwd(newPassword)
    const res = await query('UPDATE user SET password=? WHERE email=?', [hashedPwd, login])
    if (res.length <= 0) {
        throw new NotFound('user', login)
    }
}

export async function resetPassword(login: string) {
    const password = randomPassword(12)
    const hashedPwd = getHashedPwd(password)
    const res = await query('UPDATE user SET password=? WHERE email=?', [hashedPwd, login])
    if (res.length <= 0) {
        throw new NotFound('user', login)
    } else {
        return password
    }
}

export async function createUser(login: string, password?: string) {
    const pwd = password || randomPassword(12)
    const hashedPwd = getHashedPwd(pwd)
    const res = await query('INSERT INTO user (email, password) VALUES (?, ?)', [login, hashedPwd])
    if (res.length <= 0) {
        throw Error('Error creating user ' + login)
    } else {
        return pwd
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