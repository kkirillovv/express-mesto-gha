// eslint-disable-next-line max-classes-per-file
const { constants } = require('http2')

// const isValidationError = 'Переданы некорректные данные'
const isDefaultServerError = 'Ошибка сервера по умолчанию'
const isCastError = 'Cast to ObjectId failed'

class CastError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CastError'
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST // 400
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED // 401
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND // 404
  }
}

class ConflictingRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConflictingRequestError'
    this.statusCode = constants.HTTP_STATUS_CONFLICT // 409
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InternalServerError'
    this.statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR // 500
  }
}

// eslint-disable-next-line consistent-return
const handleErrors = async (req, res, func, mes, errorMessage, next) => {
  try {
    const { cardId } = req.params
    const result = await func(cardId)
    if (!result) {
      throw new NotFoundError(errorMessage)
    }
    res.status(constants.HTTP_STATUS_OK).json({ data: result, message: mes })
  } catch (err) {
    if (err.name === CastError.name) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: isCastError })
    }
    return next(new InternalServerError(isDefaultServerError))
  }
}

// const handleErrors = (err, req, res, next) => {
//   // если у ошибки нет статуса, выставляем 500
//   const { statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err

//   res
//     .status(statusCode)
//     .send({
//       // проверяем статус и выставляем сообщение в зависимости от него
//       message: statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR // 500
//         ? isDefaultServerError
//         : message,
//     })
//   next()
// }

// eslint-disable-next-line object-curly-newline
module.exports = {
  CastError,
  UnauthorizedError,
  NotFoundError,
  ConflictingRequestError,
  InternalServerError,
  handleErrors,
}