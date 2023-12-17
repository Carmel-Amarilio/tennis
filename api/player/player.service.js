import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'


export const playerService = {
    remove,
    query,
    getById,
    add,
    update,
}


async function query() {
    try {
        const criteria = {};
        const collection = await dbService.getCollection('player');
        const players = await collection.find(criteria).toArray();
        return players;
    } catch (err) {
        logger.error('Cannot find players', err);
        throw err;
    }
}




async function getById(playerId) {
    try {
        const collection = await dbService.getCollection('player')
        const player = collection.findOne({ _id: ObjectId(playerId) })
        return player
    } catch (err) {
        logger.error(`while finding player ${playerId}`, err)
        throw err
    }
}

async function remove(playerId) {
    try {
        const collection = await dbService.getCollection('player')
        await collection.deleteOne({ _id: ObjectId(playerId) })
    } catch (err) {
        logger.error(`cannot remove player ${playerId}`, err)
        throw err
    }
}

async function add(player) {
    try {
        const collection = await dbService.getCollection('player')
        await collection.insertOne(player)
        return player
    } catch (err) {
        logger.error('cannot insert player', err)
        throw err
    }
}

async function update({ _id, name, type, imgUrls, price, summary, capacity, amenities, labels, host, loc, reviews, likedByUsers, DateNotAvailable }) {
    try {
        const playerToSave = { name, type, imgUrls, price, summary, capacity, amenities, labels, host, loc, reviews, likedByUsers, DateNotAvailable }
        const collection = await dbService.getCollection('player')
        await collection.updateOne({ _id: ObjectId(_id) }, { $set: playerToSave })
        return playerToSave
    } catch (err) {
        logger.error(`cannot update player ${_id}`, err)
        throw err
    }
}


