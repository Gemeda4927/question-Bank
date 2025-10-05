
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/user.routes');
const universityRouter = require('./routes/university.routes');
const programRouter = require('./routes/program.routes'); 

const app = express();
app.use(express.json());
app.use(express.static('public'));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ====== ROUTES ======
app.use('/api/v1/users', userRouter);
app.use('/api/v1/universities', universityRouter);
app.use('/api/v1/programs', programRouter); 

module.exports = app;
