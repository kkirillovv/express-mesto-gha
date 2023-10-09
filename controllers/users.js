const User = require('../models/user')
const { ValidationError, NotFoundError } = require('../errors')

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
}

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res.status(NotFoundError.statusCode).send({ message: `Карточка с Id = ${req.user._id} не найдена` })
        return
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' })
    })
}

// const createUser = (req, res) => {
//   const { name, about, avatar } = req.body
//   User.create({ name, about, avatar })
//     .then((user) => {
//       if (user.name.length > 2 && user.name.length < 31) {
//         res.send({ data: user })
//       } else {
//         throw new ValidationError('Переданы некорректные данные при создании карточки')
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(ValidationError.statusCode).send(err.message)
//         return
//       }
//       res.status(500).send({ message: 'Ошибка по умолчанию' })
//     })
// }

// eslint-disable-next-line consistent-return
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body
    const user = new User({ name, about, avatar })
    await user.create()
    res.send({ data: user })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ValidationError.statusCode).json({ message: 'Переданы некорректные данные при создании пользователя.' })
    }
    res.status(500).send({ message: 'Ошибка по умолчанию' })
  }
}

const editUserData = (req, res) => {
  const { name, about } = req.body
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ValidationError.statusCode).send({ message: 'Переданы некорректные данные при создании карточки.' })
        return
      }
      if (err.message === 'NotFoundError') {
        res.status(NotFoundError.statusCode).send({ message: `Карточка с Id = ${req.user._id} не найдена` })
        return
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' })
    })
}

const editUserAvatar = (req, res) => {
  const { avatar } = req.body
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ValidationError.statusCode).send({ message: 'Переданы некорректные данные при создании карточки.' })
        return
      }
      if (err.message === 'NotFoundError') {
        res.status(NotFoundError.statusCode).send({ message: `Карточка с Id = ${req.user._id} не найдена` })
        return
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' })
    })
}

// eslint-disable-next-line object-curly-newline
module.exports = { getUsers, getUserById, createUser, editUserData, editUserAvatar }