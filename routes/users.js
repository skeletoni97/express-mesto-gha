const express = require('express');

const router = express.Router();

const { getUsers, getUsersId, postUsers } = require('../controllers/users');
const { patchUsersMe, patchUsersMeAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUsersId);
router.post('/', postUsers);
router.patch('/me', patchUsersMe);
router.patch('/me/avatar', patchUsersMeAvatar);

module.exports = router;
