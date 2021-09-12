const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');

//app
const app = express();

//Database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected'))
  .catch((err) => console.log(`DB CONNECTION ERR: `, err));

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

//routes middlewares
fs.readdirSync('./routes').map((route) =>
  app.use('/api', require(`./routes/${route}`))
);

//start server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on ${port}`));
