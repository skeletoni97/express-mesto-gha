const express = require('express');
const { getCards, postCards, deleteCards } = require('../controllers/cards');
const { putCardsLike } = require('../controllers/cards');

const router = express.Router();
// GET /cards — возвращает все карточки
router.get('/', getCards);

// POST /cards — создаёт карточку
router.post('/', postCards);
// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete('/:cardId', deleteCards);

router.put('/:cardId/likes', putCardsLike);
router.delete('/:cardId/likes', putCardsLike);
module.exports = router;
