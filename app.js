const express = require('express')
const mongoose = require('mongoose')
const { constants } = require('http2')
const usersRouter = require('./routes/users')
const cardsRouter = require('./routes/cards')
const auth = require('./middlewares/auth')

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

app.post('/signin', loginUser)
app.post('/signup', createUser)

app.use(auth)

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)
app.use('*', (req, res) => {
  const isPageNotFoundError = 'Запрашиваемая страница не найдена'
  res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: isPageNotFoundError })
})

app.listen(PORT)