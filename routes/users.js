const router = require('express').Router()
const {
  getUsers, getUserById, createUser, editUserData, editUserAvatar,
} = require('../controllers/users')

router.get('', getUsers)
router.get('/:userId', getUserById)
router.post('', createUser)
router.patch('/me', editUserData)
router.patch('/me/avatar', editUserAvatar)

module.exports = router