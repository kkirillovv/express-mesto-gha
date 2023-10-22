const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const { loginUser } = require('../controllers/users')
const { emailRegExp } = require('../utils/regexp')

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegExp),
    password: Joi.string().required().min(3),
  }),
}), loginUser)

module.exports = router