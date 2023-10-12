// eslint-disable-next-line max-classes-per-file
const { constants } = require('http2')

const isDefaultServerError = 'Ошибка сервера по умолчанию'
const isCastError = 'Cast to ObjectId failed'

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = 404 // HTTP_STATUS_NOT_FOUND
  }
}

class CastError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CastError'
    this.statusCode = 400 // HTTP_STATUS_BAD_REQUEST
  }
}

// eslint-disable-next-line consistent-return
const handleErrors = async (req, res, func, errorMessage) => {
  try {
    // const { id } = req.params
    const result = await func()
    if (!result) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({ message: errorMessage })
    }
    res.status(constants.HTTP_STATUS_OK).json({ data: result })
  } catch (err) {
    if (err.name === CastError.name) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: isCastError })
    }
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: isDefaultServerError })
  }
}

// eslint-disable-next-line object-curly-newline
module.exports = { NotFoundError, CastError, handleErrors }