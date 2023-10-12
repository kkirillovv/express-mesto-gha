const { constants } = require('http2')
const Card = require('../models/card')
const { CastError, handleErrors } = require('../errors')

const isValidationError = 'Переданы некорректные данные'
const isDefaultServerError = 'Ошибка сервера по умолчанию'
const isCastError = 'Cast to ObjectId failed'

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    // eslint-disable-next-line max-len
    .catch(() => res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: isDefaultServerError }))
}

const createCard = (req, res) => {
  const { name, link } = req.body
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send({ data: card }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: isValidationError })
      }
      // eslint-disable-next-line max-len
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: isDefaultServerError })
    })
}

// eslint-disable-next-line consistent-return
const deleteCardById = async (req, res) => {
  try {
    const { cardId } = req.params
    const card = await Card.findByIdAndDelete(cardId)
    if (!card) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({ message: `Карточка с Id = ${req.user._id} не существует` })
    }
    res.status(constants.HTTP_STATUS_OK).send({ data: card, message: 'Карточка удалена' })
  } catch (err) {
    if (err.name === CastError.name) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: isCastError })
    }
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: isDefaultServerError })
  }
}

const likeCardById = async (req, res) => {
  const func = (cardId) => Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  const errorMessage = `Id = ${req.user._id} карточки не существует`
  handleErrors(req, res, func, errorMessage)
}

const dislikeCardById = async (req, res) => {
  const func = (cardId) => Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  const errorMessage = `У карточки нет лайка от пользователя с Id = ${req.user._id}`
  handleErrors(req, res, func, errorMessage)
}

// eslint-disable-next-line object-curly-newline
module.exports = { getCards, createCard, deleteCardById, likeCardById, dislikeCardById }