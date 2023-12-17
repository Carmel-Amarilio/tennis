import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken
}

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(userName, password) {
    logger.debug(`auth.service - login with userName: ${userName}`)

    const user = await userService.getByUsername(userName)
    if (!user) throw new Error('Invalid userName or password')

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new Error('Invalid userName or password')

    delete user.password
    return user
}

async function signup(userName, password, fullName, imgUrl) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with userName: ${userName}, fullName: ${fullName}`)
    if (!userName || !password || !fullName) throw new Error('Missing details')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ userName, password: hash, fullName, imgUrl})
}

function getLoginToken(user) {
    const {_id, fullName,isAdmin,userName} = user
    const userInfo = {_id, fullName,isAdmin,userName }
    return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}