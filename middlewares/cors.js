const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://kirillovk.nomoredomainsrocks.ru',
  'https://kirillovk.nomoredomainsrocks.ru',
  'http://api.kirillovk.nomoredomainsrocks.ru',
  'https://api.kirillovk.nomoredomainsrocks.ru',
]

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE'

// eslint-disable-next-line no-undef, consistent-return
const cors = ((req, res, next) => {
  const { origin } = req.headers
  const { method } = req
  const requestHeaders = req.headers['access-control-request-headers']
  res.header('Access-Control-Allow-Credentials', true)
  if (allowedCors.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS)
    res.header('Access-Control-Allow-Headers', requestHeaders)
    return res.end()
  }
  next()
})

module.exports = { cors }