// app.js
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/user.routes');
const universityRouter = require('./routes/university.routes');

const app = express();

// ====== MIDDLEWARE ======

// Body parser
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ====== ROUTES ======
app.use('/api/v1/users', userRouter);
app.use('/api/v1/universities', universityRouter);


module.exports = app;
