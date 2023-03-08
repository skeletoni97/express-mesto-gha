const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ mmessage: err.message }));
});

router.get('/:userId', (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
});

// сработает при POST-запросе на URL /films
router.post('/', (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(name, about, avatar);
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' }));
});

router.patch('/me', (req, res) => {
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
});

router.patch('/me/avatar', (req, res) => {
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
});

module.exports = router;
