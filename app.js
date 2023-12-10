const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const weeklistRoutes = require('./routes/weeklistRoutes');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*Health API  */

app.get('/', (req, res) => {
  const serverName = 'Week List Server';
  const time = new Date().toLocaleString();
  const status = 'active ';
  res.json({ serverName, time, status });
});

app.use('/', userRoutes);
app.use('/weeklists', weeklistRoutes);

// Middleware Not Found API

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_URl)
    .then(() =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    )
    .catch((error) => console.log(error));
});
