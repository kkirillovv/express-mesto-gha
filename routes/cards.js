const router = require('express').Router()
const {
  getCards, createCard, deleteCardById, likeCardById, dislikeCardById,
} = require('../controllers/cards')

router.get('', getCards)
router.post('', createCard)
router.delete('/:cardId', deleteCardById)
router.put('/:cardId/likes', likeCardById)
router.delete('/:cardId/likes', dislikeCardById)

module.exports = router