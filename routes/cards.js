const router = require('express').Router()
const {
  getCards, createCard, deleteCardById, likeCardById, dislikeCardById,
} = require('../controllers/cards')

router.get('/cards', getCards)
router.post('/cards', createCard)
router.delete('/cards/:cardId', deleteCardById)
router.put('/cards/:cardId/likes', likeCardById)
router.delete('/cards/:cardId/likes', dislikeCardById)

module.exports = router