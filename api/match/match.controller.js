import { logger } from "../../services/logger.service.js"
import { socketService } from "../../services/socket.service.js"
import { matchService } from "./match.service.js"

export async function getMatches(req, res) {
    try {
        const target = req.query || null
        logger.debug('Getting Matches', target)
        const matches = await matchService.query(target)
        res.json(matches)
    } catch (err) {
        logger.error('Failed to get matchs', err)
        res.status(500).send({ err: 'Failed to get matchs' })
    }
}

export async function getMatchById(req, res) {
    try {
        const matchId = req.params.id
        const match = await matchService.getById(matchId)
        res.json(match)
    } catch (err) {
        logger.error('Failed to get match', err)
        res.status(500).send({ err: 'Failed to get match' })
    }
}

export async function addMatch(req, res) {
    try {
        const match = req.body
        const addedMatch = await matchService.add(match)
        res.json(addedMatch)
    } catch (err) {
        logger.error('Failed to add match', err)
        res.status(500).send({ err: 'Failed to add match' })
    }
}

export async function updateMatch(req, res) {
    try {
        const match = req.body
        const updatedMatch = await matchService.update(match)
        res.json(updatedMatch)
    } catch (err) {
        logger.error('Failed to update match', err)
        res.status(500).send({ err: 'Failed to update match' })
    }
}

export async function removeMatch(req, res) {
    try {
        const matchId = req.params.id
        await matchService.remove(matchId)
        res.send()
    } catch (err) {
        logger.error('Failed to remove match', err)
        res.status(500).send({ err: 'Failed to remove match' })
    }
}

