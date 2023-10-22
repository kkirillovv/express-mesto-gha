/* eslint-disable no-console */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { constants } = require('http2')
const { Promise } = require('mongoose')
const User = require('../models/user')
const { NotFoundError, CastError, ConflictingRequestError } = require('../errors')

const { NODE_ENV, JWT_SECRET } = process.env

const isValidationError = 'Переданы некорректные данные'
const isDefaultServerError = 'Ошибка сервера по умолчанию'
const isCastError = 'Cast to ObjectId failed'

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(constants.HTTP_STATUS_OK).send({ data: users })
  } catch (err) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: isDefaultServerError })
  }
}

// eslint-disable-next-line consistent-return
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: `Получение пользователя с несуществующим в БД id - ${req.user._id}` })
    }
    res.status(constants.HTTP_STATUS_OK).send({ data: user })
  } catch (err) {
    if (err.name === CastError.name) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: isCastError })
    }
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: isDefaultServerError })
  }
}

// eslint-disable-next-line consistent-return
const createUser = async (req, res, next) => {
  const { name, about, avatar, email, password } = req.body
  bcrypt.hash(password, 10)
  .then ((hash) => User.create({ name, about, avatar, email, password: hash }))
  .then ((user) => res.status(constants.HTTP_STATUS_CREATED).send({
    name: user.name, 
    about: user.about, 
    avatar: user.avatar, 
    email: user.email, 
    _id: user._id
  }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new CastError({ message: isValidationError }))
    } else if (err.code === 11000) {
      next(new ConflictingRequestError({ message: 'Такой email уже существует в базе пользователей'}))
    } else {
      next(err)
    }
  })
}

// eslint-disable-next-line consistent-return
const editUserData = async (req, res) => {
  try {
    const { name, about } = req.body
    // eslint-disable-next-line max-len
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    if (!user) {
      return Promise.reject(new NotFoundError(`Карточка с Id = ${req.user._id} не найдена`))
    }
    res.status(constants.HTTP_STATUS_OK).send({ data: user })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: isValidationError })
    }
    if (err.name === NotFoundError.name) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send(err.message)
    }
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: isDefaultServerError })
  }
}

// eslint-disable-next-line consistent-return
const editUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body
    // eslint-disable-next-line max-len
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    if (!user) {
      return Promise.reject(new NotFoundError(`Карточка с Id = ${req.user._id} не найдена`))
    }
    res.status(constants.HTTP_STATUS_OK).send({ data: user })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: isValidationError })
    }
    if (err.message === NotFoundError.name) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send(err.message)
    }
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: isDefaultServerError })
  }
}

const loginUser = (req, res, next) => {
  const { email, password } = req.body
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, 
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secretkey', 
        { expiresIn: '7d' })
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      })
      res.status(constants.HTTP_STATUS_OK).send({ token })
    })
    .catch((err) => next(err))
}

// eslint-disable-next-line object-curly-newline
module.exports = { 
  getUsers, 
  getUserById, 
  createUser, 
  editUserData, 
  editUserAvatar, 
  loginUser 
}