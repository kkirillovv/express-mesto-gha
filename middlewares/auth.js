const jwt = require('jsonwebtoken')
const { UnauthorizedError } = require('../errors')

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '')
  let payload

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secretkey');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload
  next()
}