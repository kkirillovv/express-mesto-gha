const { constants } = require('http2')
const Card = require('../models/card')
// eslint-disable-next-line object-curly-newline
const { ForbiddenError, NotFoundError, CastError } = require('../errors')

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
const handleErrors = async (req, res, func, mes, errorMessage, next) => {
  try {
    const { cardId } = req.params
    const result = await func(cardId)
    if (!result) {
      throw new NotFoundError({ message: errorMessage })
    }
    res.status(constants.HTTP_STATUS_OK).json({ data: result, message: mes })
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError({ message: isCastError }))
    }
    return next(err)
  }
}

// eslint-disable-next-line consistent-return
const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(new NotFoundError({ message: 'Карточка с указанным id не существует' }))
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Карточка с указанным id не существует' })
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: 'Нельзя удалять карточку другого пользователя' })
      }
    })
    .catch(next)
  const func = (cardId) => Card.findByIdAndDelete(cardId)
  const errorMessage = 'Удаление карточки с несуществующим в БД id'
  const mes = 'Карточка удалена'
  handleErrors(req, res, func, mes, errorMessage, next)
}

const likeCardById = (req, res, next) => {
  const func = (cardId) => Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  const errorMessage = 'Id карточки не существует'
  const mes = 'Поставили лайк'
  handleErrors(req, res, func, mes, errorMessage, next)
}

const dislikeCardById = (req, res, next) => {
  const func = (cardId) => Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  const mes = 'Убрали лайк'
  const errorMessage = 'Удаление лайка у карточки с несуществующим в БД id'
  handleErrors(req, res, func, mes, errorMessage, next)
}

// eslint-disable-next-line object-curly-newline
module.exports = { getCards, createCard, deleteCardById, likeCardById, dislikeCardById }