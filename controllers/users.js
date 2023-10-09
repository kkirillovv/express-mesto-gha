const { Promise } = require('mongoose')
const User = require('../models/user')
const { ValidationError, NotFoundError } = require('../errors')

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).send({ data: users })
  } catch (err) {
    res.status(500).send({ message: 'Ошибка по умолчанию' })
  }
}

// eslint-disable-next-line consistent-return
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return Promise.reject(new NotFoundError(`Карточка с Id = ${req.user._id} не найдена`))
    }
    res.status(200).send({ data: user })
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return res.status(NotFoundError.statusCode).send(err.message)
    }
    res.status(500).send({ message: 'Ошибка по умолчанию' })
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
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' })
    }
    res.status(500).send({ message: 'Ошибка по умолчанию' })
  }
}

// eslint-disable-next-line consistent-return
const editUserData = async (req, res) => {
  try {
    const { name, about } = req.body
    const user = await User.findByIdAndUpdate(req.user._id, { name, about })
    if (!user) {
      return Promise.reject(new NotFoundError(`Карточка с Id = ${req.user._id} не найдена`))
    }
    res.status(200).send({ data: user })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ValidationError.statusCode).send({ message: 'Переданы некорректные данные при создании карточки.' })
    }
    if (err.message === 'NotFoundError') {
      return res.status(NotFoundError.statusCode).send({ message: `Карточка с Id = ${req.user._id} не найдена` })
    }
    res.status(500).send({ message: 'Ошибка по умолчанию' })
  }
}

// eslint-disable-next-line consistent-return
const editUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body
    const user = await User.findByIdAndUpdate(req.user._id, { avatar })
    if (!user) {
      return Promise.reject(new NotFoundError(`Карточка с Id = ${req.user._id} не найдена`))
    }
    res.status(200).send({ data: user })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ValidationError.statusCode).send({ message: 'Переданы некорректные данные при создании карточки.' })
    }
    if (err.message === 'NotFoundError') {
      return res.status(NotFoundError.statusCode).send({ message: `Карточка с Id = ${req.user._id} не найдена` })
    }
    res.status(500).send({ message: 'Ошибка по умолчанию' })
  }
}

// eslint-disable-next-line object-curly-newline
module.exports = { getUsers, getUserById, createUser, editUserData, editUserAvatar }