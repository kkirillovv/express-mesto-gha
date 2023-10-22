const router = require('express').Router()
const {
  getUsers, getUserById, getUserInfo, editUserData, editUserAvatar,
} = require('../controllers/users')

router.get('', getUsers)
router.get('/:userId', getUserById)
router.get('/me', getUserInfo)
router.patch('/me', editUserData)
router.patch('/me/avatar', editUserAvatar)

module.exports = router