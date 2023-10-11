// eslint-disable-next-line max-classes-per-file
const mongoose = require('mongoose')

const isDefaultServerError = 'Ошибка по умолчанию'
const isCastError = 'Cast to ObjectId failed'

class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
    this.statusCode = 400
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

class CastError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CastError'
    this.statusCode = 400
  }
}

// eslint-disable-next-line consistent-return
const handleErrors = async (req, res, func, message, errorMessage) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Promise.reject(new CastError(isCastError))
    }
    const result = await func(id)
    if (!result) {
      return Promise.reject(new NotFoundError(errorMessage))
    }
    res.status(200).json({ data: result, message })
  } catch (err) {
    if (err.name === CastError.name) {
      return res.status(CastError.statusCode).send(err.message)
    }
    if (err.name === NotFoundError.name) {
      return res.status(NotFoundError.statusCode).send(err.message)
    }
    res.status(500).send({ message: isDefaultServerError })
  }
}

// eslint-disable-next-line object-curly-newline
module.exports = { ValidationError, NotFoundError, CastError, handleErrors }