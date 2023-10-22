const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const { createUser } = require('../controllers/users')

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(http|https):\/\/[^ "]+$/),
    email: Joi.string().required().pattern(/^\S+@\S+\.\S+$/),
    password: Joi.string().required().min(3),
  }),
}), createUser)

module.exports = router