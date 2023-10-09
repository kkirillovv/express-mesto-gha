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

const deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card && card.owner.equals(req.user._id)) {
        Card.deleteOne(card)
          .then(() => res.send({ message: 'Карточка удалена' }))
      }
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res.status(NotFoundError.statusCode).send({ message: `Карточка с Id = ${req.user._id} не найдена` })
        return
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' })
    })
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