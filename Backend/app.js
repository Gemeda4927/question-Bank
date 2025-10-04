// app.js
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/user.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/users', userRouter);

// Export app
module.exports = app;
