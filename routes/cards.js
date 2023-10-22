const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')

const {
  getCards, createCard, deleteCardById, likeCardById, dislikeCardById,
} = require('../controllers/cards')

router.get('', getCards)

router.post('', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+$/),
  }),
}), createCard)

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCardById)

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), likeCardById)

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), dislikeCardById)

module.exports = router