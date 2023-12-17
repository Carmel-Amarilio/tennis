import express from 'express'
import { addMatch, getMatchById, getMatches, removeMatch, updateMatch } from './match.controller.js'
// import { validateMatch } from '../../middlewares/validator.middleware.js'

export const matchRoutes = express.Router()

matchRoutes.get('/', getMatches)
matchRoutes.get('/:id', getMatchById)
matchRoutes.post('/', addMatch)
matchRoutes.put('/', updateMatch)
matchRoutes.delete('/:id', removeMatch)

// stayRoutes.put('/like/:id', requireAuth, updateMatchLikes)
