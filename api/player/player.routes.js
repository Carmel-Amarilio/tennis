import express from 'express'
import { addPlayer, getPlayerById, getPlayers, removePlayer, updatePlayer } from './player.controller.js'

export const playerRoutes = express.Router()

playerRoutes.get('/', getPlayers)
playerRoutes.get('/:id', getPlayerById)
playerRoutes.post('/', addPlayer)
playerRoutes.put('/', updatePlayer)
playerRoutes.delete('/:id', removePlayer)

