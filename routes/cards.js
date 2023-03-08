const express = require('express');

const router = express.Router();
const Card = require('../models/card');

// GET /cards — возвращает все карточки
router.get('/cards', (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

// POST /cards — создаёт карточку
router.post('/cards', (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete('/cards/:cardId', (req, res) => {
  console.log(req.body._id);
  Card.findByIdAndRemove(req.body._id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

module.exports = router;

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};

router.put('/cards/:cardId/likes', (req, res) => {
  const userId = req.user._id;
  const cardId = req.body._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Произошла ошибка' });
      }

      const isLiked = card.likes.includes(userId);
      const update = isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } };
      const options = { new: true };

      Card.findByIdAndUpdate(cardId, update, options)
        .then((updatedCard) => res.send(updatedCard))
        .catch(() => res.status(400).send({ message: 'переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' }));
    })
    .catch(() => res.status(400).send({ message: 'переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' }));
});
