const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.postCards = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCards = (req, res) => {
  const { cardId } = req.params;
  if (!ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: 'Передан некорректный _id карточки' });
  }
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } if (card.owner._id.toString() !== req.user._id.toString()) {
        res.status(403).send({ message: 'Недостаточно прав на удаление карточки.' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// module.exports.putCardsLike = (req, res) => {
//   const userId = req.user._id;
//   const { cardId } = req.params;
//   console.log(cardId);
//   if (!ObjectId.isValid(cardId)) {
//     return res.status(400).send({ message: 'Передан некорректный _id карточки' });
//   }
//   return Card.findById(cardId)
//     .then((card) => {
//       if (!card) {
//         return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
//       }

//       const isLiked = card.likes.includes(userId);
//       const update = isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } };
//       const options = { new: true };

//       return Card.findByIdAndUpdate(cardId, update, options)
//         .then((updatedCard) => res.send(updatedCard))
//         .catch(() => res.status(400).send({ message:
// 'Переданы некорректные данные для постановки/снятии лайка.' }));
//     })
//     .catch((err) => res.status(500).send({ message: err.message }));
// };

module.exports.putCardsLike = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
        .then((updatedCard) => res.send(updatedCard))
        .catch((err) => res.status(500).send({ message: err.message }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный _id карточки' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCardsLike = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
        .then((updatedCard) => res.send(updatedCard))
        .catch((err) => res.status(500).send({ message: err.message }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный _id карточки' });
      }
      return res.status(500).send({ message: err.message });
    });
};
