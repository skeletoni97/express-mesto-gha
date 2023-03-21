const express = require('express');

const router = express.Router();

const { getUsers, getUsersId, createUser } = require('../controllers/users');
const { patchUsersMe, patchUsersMeAvatar, getUsersMe } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUsersMe);
router.get('/:userId', getUsersId);
router.post('/', createUser);
router.patch('/me', patchUsersMe);

router.patch('/me/avatar', patchUsersMeAvatar);

module.exports = router;
