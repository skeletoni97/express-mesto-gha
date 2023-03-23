const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { ObjectId } = mongoose.Types;

const User = require('../models/user');

module.exports.getUsersMe = (req, res) => {
  User.findById({ _id: req.user._id })
    .orFail(() => res.status(404).send({ message: 'По переданному id отсутствуют данные.' }))
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ mmessage: err.message }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Электронная почта и пароль обязательны' });
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неправильные почта ' });
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send({ message: 'Неправильные  пароль' });
          }

          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.cookie('jwt', token, { httpOnly: true, sameSite: true });
          return res.send({ user, token });
        });
    })
    .catch((err) => res.status(500).send({ message: `An error occurred: ${err.message}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email: req.body.email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      console.log(err.name);
      if (err.code === 11000) {
        return res.status(409).send({ message: 'hПереданы некорректные данные при создании пользователя' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ mmessage: err.message }));
};

module.exports.getUsersId = (req, res) => {
  if (!ObjectId.isValid(req.params.userId)) {
    return res.status(400).send({ message: 'Передан несуществующий _id карточки' });
  }
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => res.status(500).send({ mmessage: err.message }));
};

module.exports.patchUsersMe = (req, res) => {
  const userId = req.user._id;
  const { about, name } = req.body;
  User.findByIdAndUpdate(userId, { about, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.patchUsersMeAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(500).send({ message: err.message });
    });
};
