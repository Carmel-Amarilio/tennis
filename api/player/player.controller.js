import { logger } from "../../services/logger.service.js"
import { socketService } from "../../services/socket.service.js"
import { playerService } from "./player.service.js"

export async function getPlayers(req, res) {

    try {
        logger.debug('Getting Players')
        const players = await playerService.query()
        res.json(players)
    } catch (err) {
        logger.error('Failed to get players', err)
        res.status(500).send({ err: 'Failed to get players' })
    }
}

export async function getPlayerById(req, res) {

    try {
        const playerId = req.params.id
        const player = await playerService.getById(playerId)
        res.json(player)
    } catch (err) {
        logger.error('Failed to get player', err)
        res.status(500).send({ err: 'Failed to get player' })
    }
}

export async function addPlayer(req, res) {
    try {
        const player = req.body
        const addedPlayer = await playerService.add(player)
        res.json(addedPlayer)
    } catch (err) {
        logger.error('Failed to add player', err)
        res.status(500).send({ err: 'Failed to add player' })
    }
}

export async function updatePlayer(req, res) {
    try {
        const player = req.body
        const updatedPlayer = await playerService.update(player)
        res.json(updatedPlayer)
    } catch (err) {
        logger.error('Failed to update player', err)
        res.status(500).send({ err: 'Failed to update player' })
    }
}

export async function removePlayer(req, res) {
    try {
        const playerId = req.params.id
        await playerService.remove(playerId)
        res.send()
    } catch (err) {
        logger.error('Failed to remove player', err)
        res.status(500).send({ err: 'Failed to remove player' })
    }
}

