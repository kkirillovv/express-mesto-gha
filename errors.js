// eslint-disable-next-line max-classes-per-file
const { constants } = require('http2')
const mongoose = require('mongoose')

const isDefaultServerError = 'Ошибка сервера по умолчанию'
const isCastError = 'Cast to ObjectId failed'

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = 404 // NOT_FOUND
  }
}

class CastError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CastError'
    this.statusCode = 400 // BAD_REQUEST
  }
}

// eslint-disable-next-line consistent-return
const handleErrors = async (req, res, func, errorMessage) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: isCastError })
    }
    const result = await func(id)
    if (!result) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({ message: errorMessage })
    }
    res.status(constants.HTTP_STATUS_OK).json({ data: result })
  } catch (err) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: isDefaultServerError })
  }
}

// eslint-disable-next-line object-curly-newline
module.exports = { NotFoundError, CastError, handleErrors }