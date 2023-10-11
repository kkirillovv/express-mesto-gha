const { constants } = require('http2')
const { Promise } = require('mongoose')
const User = require('../models/user')
const { NotFoundError, CastError } = require('../errors')

const isValidationError = 'Переданы некорректные данные'
const isDefaultServerError = 'Ошибка по умолчанию'
const isCastError = 'Cast to ObjectId failed'

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).send({ data: users })
  } catch (err) {
    res.status(500).send({ message: isDefaultServerError })
  }
}

// eslint-disable-next-line consistent-return
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return Promise.reject(new NotFoundError(`Получение пользователя с несуществующим в БД id - ${req.user._id}`))
    }
    res.status(200).send({ data: user })
  } catch (err) {
    if (err.name === CastError.name) {
      return res.status(400).json({ message: isCastError })
    }
    if (err.name === NotFoundError.name) {
      return res.status(404).json(err.message)
    }
    res.status(500).send({ message: isDefaultServerError })
  }
}

// eslint-disable-next-line consistent-return
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body
    const user = await User.create({ name, about, avatar })
    res.status(201).send({ data: user })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: isValidationError })
    }
    res.status(500).send({ message: isDefaultServerError })
  }
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
    res.status(200).send({ data: user })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: isValidationError })
    }
    if (err.name === NotFoundError.name) {
      return res.status(404).send(err.message)
    }
    res.status(500).send({ message: isDefaultServerError })
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
    res.status(200).send({ data: user })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: isValidationError })
    }
    if (err.message === NotFoundError.name) {
      return res.status(404).send(err.message)
    }
    res.status(500).send({ message: isDefaultServerError })
  }
}

// eslint-disable-next-line object-curly-newline
module.exports = { getUsers, getUserById, createUser, editUserData, editUserAvatar }