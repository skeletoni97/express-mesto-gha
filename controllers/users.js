const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ mmessage: err.message }));
};

module.exports.getUsersId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        console.log(user);
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
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

module.exports.postUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(name, about, avatar);
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' }));
};

module.exports.patchUsersMe = (req, res) => {
  const userId = req.user._id;
  const updatedFields = req.body;
  User.findByIdAndUpdate(userId, updatedFields, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        console.log(user);
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
        console.log(user);
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
