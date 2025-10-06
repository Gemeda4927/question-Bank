const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/user.routes');
const universityRouter = require('./routes/university.routes');
const examRouter = require('./routes/exam.routes'); 

const app = express();

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(express.static('public'));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ====== ROUTES ======
app.use('/api/v1/users', userRouter);
app.use('/api/v1/universities', universityRouter);
app.use('/api/v1/exams', examRouter);


module.exports = app;
