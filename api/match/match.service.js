import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'


export const matchService = {
    query,
    remove,
    getById,
    add,
    update,
}


async function query({ page = 1, filter }) {
    const pageSize = 20
    const skip = (page - 1) * pageSize
    const { playerId, outcome, score, players, competitorId } = filter
    try {
        const criteria = {}
        if (players) criteria['type.players'] = players
        if (score) criteria['type.score'] = score
        if (outcome) {
            if (playerId) criteria[outcome] = { $elemMatch: { _id: playerId } }
            if (competitorId) criteria[outcome === 'win' ? 'loss' : 'win'] = { $elemMatch: { _id: competitorId } }
        } else if (playerId) {
            criteria['$or'] = [];
            if (competitorId) {
                criteria['$or'].push(
                    { 'players.left': { $elemMatch: { _id: playerId } }, 'players.right._id': competitorId },
                    { 'players.right': { $elemMatch: { _id: playerId } }, 'players.left._id': competitorId },
                )
            } else {
                criteria['$or'].push(
                    { 'players.left': { $elemMatch: { _id: playerId } } },
                    { 'players.right': { $elemMatch: { _id: playerId } } },
                )
            }
        }

        const collection = await dbService.getCollection('match')
        const totalMatches = await collection.countDocuments(criteria)
        const matches = await collection.find(criteria).sort({ 'at': -1 }).skip(skip).limit(pageSize).toArray()
        return { data: matches, maxPage: Math.ceil(totalMatches / pageSize) }
    } catch (err) {
        logger.error('Cannot find matches', err)
        throw err;
    }
}




async function getById(matchId) {
    try {
        const collection = await dbService.getCollection('match')
        const match = collection.findOne({ _id: ObjectId(matchId) })
        return match
    } catch (err) {
        logger.error(`while finding match ${matchId}`, err)
        throw err
    }
}

async function remove(matchId) {
    try {
        const collection = await dbService.getCollection('match')
        await collection.deleteOne({ _id: ObjectId(matchId) })
    } catch (err) {
        logger.error(`cannot remove match ${matchId}`, err)
        throw err
    }
}

async function add(match) {
    try {
        const collection = await dbService.getCollection('match')
        await collection.insertOne(match)
        return match
    } catch (err) {
        logger.error('cannot insert match', err)
        throw err
    }
}

async function update({ _id, type, players, win, loss, winScore, losScore, winSide, at }) {
    const matchToUpdate = { type, players, win, loss, winScore, losScore, winSide, at }
    try {
        const collection = await dbService.getCollection('match')
        await collection.updateOne({ _id: ObjectId(_id) }, { $set: matchToUpdate })
        return { _id, type, players, win, loss, winScore, losScore, winSide, at }
    } catch (err) {
        logger.error(`cannot update match ${_id}`, err)
        throw err
    }
}


