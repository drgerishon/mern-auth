const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
//middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes middleware
app.use('/api/users', userRoute);

//errorhandler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
//CONNECT TO MONGO DB
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
