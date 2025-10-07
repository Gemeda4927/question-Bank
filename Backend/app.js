const express = require('express');
const morgan = require('morgan');
const path = require('path');

// ================== IMPORT ROUTERS ==================
const userRouter = require('./routes/user.routes');
const universityRouter = require('./routes/university.routes');
const examRouter = require('./routes/exam.routes');
const departmentRouter = require('./routes/department.routes');
const programRouter = require('./routes/program.routes');
const courseRouter = require('./routes/course.routes');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
}

app.use('/api/v1/users', userRouter);
app.use('/api/v1/universities', universityRouter);
app.use('/api/v1/exams', examRouter);
app.use('/api/v1/departments', departmentRouter);
app.use('/api/v1/programs', programRouter);
app.use('/api/v1/courses', courseRouter);

module.exports = app;
