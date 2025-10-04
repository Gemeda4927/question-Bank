// app.js
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
app.use(express.json()); 
app.use(express.static('public')); 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 2) ROUTES
app.get('/', (req, res) => {
  res.send('Hello from Express app!');
});


// 3) EXPORT APP
module.exports = app;
