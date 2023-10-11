// eslint-disable-next-line max-classes-per-file
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

module.exports = { ValidationError, NotFoundError, CastError }