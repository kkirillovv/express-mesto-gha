const express = require('express')
const mongoose = require('mongoose')
const usersRouter = require('./routes/users')
const cardsRouter = require('./routes/cards')

// Слушаем 3000 порт
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env

const app = express()

// подключаемся к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
})

app.use((req, res, next) => {
  req.user = {
    _id: '6523e95d758a8272a6f38175', // вставьте сюда _id созданного в предыдущем пункте пользователя
  }
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена.' })
})

app.listen(PORT)