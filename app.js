const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, isCelebrateError, errors } = require('celebrate');
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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }).unknown(true),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
  }).unknown(true),
}), createUser);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use((req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
  next();
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
  next()
});

// app.use((err, req, res, next) => {
//   let details;

//   if (isCelebrateError(err)) {
//     details = new BadRequestError(err.details.get('body'));
//   } else {
//     details = err;
//   }

//   const { statusCode = 500, message = 'На сервере произошла ошибка' } = details;
//   res.status(statusCode).send({
//     message,
//   });
//   next();
// });

app.listen(PORT, () => {
  console.log('privet');
});
