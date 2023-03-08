const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join((__dirname, 'public'))));
app.use((req, res, next) => {
  req.user = {
    _id: '6407a79620ecd0df2f82cb7d',
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
  next();
});

app.listen(PORT, () => {
  console.log('privet');
});
