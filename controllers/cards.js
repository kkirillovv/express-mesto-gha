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
  // const card = Card.findById(req.params.cardId)
  // if (card.owner.toString() !== req.user._id) {
  //   return Promise.reject(new ForbiddenError({
  //  message: 'Нельзя удалять карточку другого пользователя' }))
  // }
  Card.findById(req.params.cardId).orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: 'Нельзя удалять карточку другого пользователя' })
      }
    })
    .catch(next)
  const func = (cardId) => Card.findByIdAndDelete(cardId)
  const errorMessage = 'Удаление карточки с несуществующим в БД id'
  const mes = 'Карточка удалена'
  handleErrors(req, res, func, mes, errorMessage, next)
}

// const deleteCard = async (req, res, next) => {
//   try {
//     const { cardId } = req.params;

//     const card = await Card.findById(cardId);

//     if (!card) {
//       const notFoundError = new NotFoundError('Карточка с указанным _id не найдена.');
//       return next(notFoundError);
//     }

//     if (card.owner.toString() !== req.user._id) {
//       const forbiddenError = new ForbiddenError('Недостаточно прав для удаления карточки');
//       return next(forbiddenError);
//     }

//     await Card.findByIdAndDelete(cardId);
//     return res.status(HTTP_STATUS_OK).json({ message: 'Карточка удалена' });
//   } catch (error) {
//     const internalError = new InternalServerError('На сервере произошла ошибка');
//     return next(internalError);
//   }
// };

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