const mongoose = require('mongoose')
const Card = require('../models/card')
const { ValidationError, NotFoundError } = require('../errors')

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }))
}

const createCard = (req, res) => {
  const { name, link } = req.body
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ValidationError.statusCode).send({ message: 'Переданы некорректные данные при создании карточки.' })
        return
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' })
    })
}

// eslint-disable-next-line consistent-return
const deleteCardById = async (req, res) => {
  try {
    const { cardId } = req.params
    const card = await Card.findByIdAndDelete(cardId)
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return Promise.reject(new NotFoundError(`Карточка с Id = ${req.user._id} не найдена`))
    }
    res.status(200).send({ data: card, message: 'Карточка удалена' })
  } catch (err) {
    if (err.name === 'NotFoundError') {
      return res.status(NotFoundError.statusCode).send(err.message)
    }
    res.status(500).send({ message: 'Ошибка по умолчанию' })
  }
}

const likeCardById = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ValidationError.statusCode).send({ message: 'Переданы некорректные данные при создании карточки.' })
        return
      }
      if (err.message === 'NotFoundError') {
        res.status(NotFoundError.statusCode).send({ message: `Карточка с Id = ${req.user._id} не найдена` })
        return
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' })
    })
}

const dislikeCardById = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ValidationError.statusCode).send({ message: 'Переданы некорректные данные при создании карточки.' })
        return
      }
      if (err.message === 'NotFoundError') {
        res.status(NotFoundError.statusCode).send({ message: `Карточка с Id = ${req.user._id} не найдена` })
        return
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' })
    })
}

// eslint-disable-next-line object-curly-newline
module.exports = { getCards, createCard, deleteCardById, likeCardById, dislikeCardById }