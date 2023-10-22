/* eslint-disable no-console */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { constants } = require('http2')
const { Promise } = require('mongoose')
const User = require('../models/user')
// eslint-disable-next-line object-curly-newline
const { UnauthorizedError, NotFoundError, ConflictingRequestError } = require('../errors')

const { NODE_ENV, JWT_SECRET } = process.env

// const isValidationError = 'Переданы некорректные данные'
// const isDefaultServerError = 'Ошибка сервера по умолчанию'
// const isCastError = 'Cast to ObjectId failed'
const isWrongEmailOrPassword = 'Неправильные почта или пароль'

// eslint-disable-next-line consistent-return
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
    res.status(constants.HTTP_STATUS_OK).send({ data: users })
  } catch (err) {
    return next(err)
  }
}

// eslint-disable-next-line consistent-return
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      throw new NotFoundError({ message: `Получение пользователя с несуществующим в БД id - ${req.params.userId}` })
    }
    res.status(constants.HTTP_STATUS_OK).send({ data: user })
  } catch (err) {
    // if (err.name === 'CastError') {
    //   return next(new CastError({ message: isCastError }))
    // }
    return next(err)
  }
}

// eslint-disable-next-line consistent-return
const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail()
    res.status(constants.HTTP_STATUS_OK).send({ data: user })
  } catch (err) {
    return next(err)
  }
}

// eslint-disable-next-line consistent-return
const createUser = async (req, res, next) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { name, about, avatar, email, password } = req.body

    const hash = await bcrypt.hash(password, 10)
    // eslint-disable-next-line object-curly-newline
    const user = await User.create({ name, about, avatar, email, password: hash })
    res.status(constants.HTTP_STATUS_CREATED).json({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    })
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictingRequestError({ message: 'Такой email уже существует в базе пользователей' }))
    }
    return next(err)
  }
}

// eslint-disable-next-line consistent-return
const editUserData = async (req, res, next) => {
  try {
    const { name, about } = req.body
    // eslint-disable-next-line max-len
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    if (!user) {
      return Promise.reject(new NotFoundError({ message: `Пользователь с Id = ${req.user._id} не найден` }))
    }
    res.status(constants.HTTP_STATUS_OK).send({ data: user })
  } catch (err) {
    return next(err)
  }
}

// eslint-disable-next-line consistent-return
const editUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body
    // eslint-disable-next-line max-len
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    if (!user) {
      return Promise.reject(new NotFoundError({ message: `Пользователь с Id = ${req.user._id} не найден` }))
    }
    res.status(constants.HTTP_STATUS_OK).send({ data: user })
  } catch (err) {
    return next(err)
  }
}

// eslint-disable-next-line consistent-return
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findUserByCredentials(email, password)
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secretkey',
      { expiresIn: '7d' },
    )
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
    })
    res.status(constants.HTTP_STATUS_OK).send({ token })
  } catch (err) {
    if (err.message === isWrongEmailOrPassword) {
      return next(new UnauthorizedError(err.message))
    }
    return next(err)
  }
}

// eslint-disable-next-line object-curly-newline
module.exports = {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  editUserData,
  editUserAvatar,
  loginUser,
}