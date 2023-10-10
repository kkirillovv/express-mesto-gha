const { Promise } = require('mongoose')
const User = require('../models/user')
const { NotFoundError } = require('../errors')

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
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: isValidationError })
    }
    if (err.name === 'CastError') {
      return res.status(404).send({ message: isCastError })
    }
    if (err.name === 'NotFoundError') {
      return res.status(NotFoundError.statusCode).send(err.message)
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
      return res.status(400).send({ message: isValidationError })
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
      return res.status(400).send({ message: isValidationError })
    }
    if (err.name === 'NotFoundError') {
      return res.status(NotFoundError.statusCode).send(err.message)
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
      return res.status(400).send({ message: isValidationError })
    }
    if (err.message === 'NotFoundError') {
      return res.status(NotFoundError.statusCode).send(err.message)
    }
    res.status(500).send({ message: isDefaultServerError })
  }
}

// eslint-disable-next-line object-curly-newline
module.exports = { getUsers, getUserById, createUser, editUserData, editUserAvatar }