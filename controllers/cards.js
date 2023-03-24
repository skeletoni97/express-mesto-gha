const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.postCards = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

module.exports.deleteCards = (req, res, next) => {
  const { cardId } = req.params;
  if (!ObjectId.isValid(cardId)) {
    next(new BadRequestError('Передан некорректный _id карточки.'));
  }
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        next(new ForbiddenError('Недостаточно прав на удаление карточки.'));
      }
      card.deleteOne().then(() => res.send({ massage: 'успешно удалена.' }));
    })
    .catch((err) => next(err));
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

module.exports.putCardsLike = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
        .then((updatedCard) => res.send(updatedCard))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки.'));
      }
      next(err);
    });
};

module.exports.deleteCardsLike = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      return Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
        .then((updatedCard) => res.send(updatedCard))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки.'));
      }
      next(err);
    });
};
