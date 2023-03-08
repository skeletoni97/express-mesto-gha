const express = require('express');

const router = express.Router();
const Card = require('../models/card');

// GET /cards — возвращает все карточки
router.get('/', (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
});

// POST /cards — создаёт карточку
router.post('/', (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: err.message });
    });
});

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete('/:cardId', (req, res) => {
  console.log(req.body._id);
  Card.findByIdAndRemove(req.body._id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.put('/:cardId/likes', (req, res) => {
  const userId = req.user._id;
  const cardId = req.body._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }

      const isLiked = card.likes.includes(userId);
      const update = isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } };
      const options = { new: true };

      Card.findByIdAndUpdate(cardId, update, options)
        .then((updatedCard) => res.send(updatedCard))
        .catch(() => res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }));
    })
    .catch((err) => res.status(500).send({ message: err.maassage }));
});

module.exports = router;
