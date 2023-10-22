const express = require('express')
const mongoose = require('mongoose')
const { constants } = require('http2')
const { errors } = require('celebrate')

const usersRouter = require('./routes/users')
const loginUser = require('./routes/signin')
const createUser = require('./routes/signup')
const cardsRouter = require('./routes/cards')
const auth = require('./middlewares/auth')
// const handleErrors = require('./errors')

// Слушаем 3000 порт
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env

// подключаемся к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/signin', loginUser)
app.use('/signup', createUser)

app.use('/users', auth, usersRouter)
app.use('/cards', auth, cardsRouter)
app.use('*', auth, (req, res) => {
  const isPageNotFoundError = 'Запрашиваемая страница не найдена'
  res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: isPageNotFoundError })
})

app.use(errors())
// app.use(handleErrors)

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR // 500
        ? 'Ошибка сервера по умолчанию'
        : message,
    })
  next()
})

app.listen(PORT)