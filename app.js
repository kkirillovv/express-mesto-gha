// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const { errors } = require('celebrate')
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors')

const usersRouter = require('./routes/users')
const loginUser = require('./routes/signin')
const createUser = require('./routes/signup')
const cardsRouter = require('./routes/cards')
const auth = require('./middlewares/auth')
const { requestLogger, errorLogger } = require('./middlewares/logger')
// const { cors } = require('./middlewares/cors')
const { NotFoundError, handleErrors } = require('./errors')

// Слушаем 3000 порт
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env

// подключаемся к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
})

const app = express()
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://kirillovk.nomoredomainsrocks.ru',
    'https://api.kirillovk.nomoredomainsrocks.ru',
    'http://kirillovk.nomoredomainsrocks.ru',
    'http://api.kirillovk.nomoredomainsrocks.ru',
  ],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
// app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(requestLogger) // подключаем логгер запросов

// за ним идут все обработчики роутов
app.use('/signin', loginUser)
app.use('/signup', createUser)
app.use(auth)
app.use('/users', usersRouter)
app.use('/cards', cardsRouter)
// eslint-disable-next-line no-unused-vars
app.use('*', (req, res) => {
  const isPageNotFoundError = 'Запрашиваемая страница не найдена'
  throw new NotFoundError(isPageNotFoundError)
})

app.use(errorLogger) // подключаем логгер ошибок

app.use(errors()) // обработчик ошибок celebrate
app.use(handleErrors) // централизованный обработчик ошибок

app.listen(PORT)