import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { playerService } from '../player/player.service.js'

export const matchMapService = {
    queryMap,
}

async function queryMap(filter) {
    const allPlayers = await playerService.query()

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
        const matches = await collection.find(criteria).toArray()
        return getMatchesMap(matches)
    } catch (err) {
        logger.error('Cannot find matches', err)
        throw err;
    }
}


function getMatchesMap(matches) {
    const winCount = {}
    const lossCount = {}
    matches.map(({ _id, type, players, win, loss, winScore, losScore, winSide }) => {
        win.map(({ fullName }) => winCount[fullName] = (winCount[fullName] || 0) + 1)
        loss.map(({ fullName }) => lossCount[fullName] = (lossCount[fullName] || 0) + 1)
    })
    return { winCount, lossCount }

}