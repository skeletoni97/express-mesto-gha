const express = require('express');

const { celebrate, Joi } = require('celebrate');

const router = express.Router();

const { getUsers, getUsersId, createUser } = require('../controllers/users');
const { patchUsersMe, patchUsersMeAvatar, getUsersMe } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUsersMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUsersId);
router.post('/', createUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUsersMe);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  }),
}), patchUsersMeAvatar);

module.exports = router;
