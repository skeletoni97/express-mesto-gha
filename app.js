const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
// app.use(express.static(path.join((__dirname, 'public'))));
// app.use((req, res, next) => {
//   req.user = {
//     _id: '641a15bb5bec531f22940f2f',
//   };

//   next();
// });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUser);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use((req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
  next();
});

app.listen(PORT, () => {
  console.log('privet');
});
