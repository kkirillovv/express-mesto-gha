const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')

const {
  getUsers, getUserById, getUserInfo, editUserData, editUserAvatar,
} = require('../controllers/users')

router.get('', getUsers)
router.get('/me', getUserInfo)

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24),
  }),
}), getUserById)

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editUserData)

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+$/),
  }),
}), editUserAvatar)

module.exports = router