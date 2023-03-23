const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { getCards, postCards, deleteCards } = require('../controllers/cards');
const { putCardsLike, deleteCardsLike } = require('../controllers/cards');

const router = express.Router();
// GET /cards — возвращает все карточки
router.get('/', getCards);

// POST /cards — создаёт карточку
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  }),
}), postCards);
// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCards);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), putCardsLike);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCardsLike);
module.exports = router;
