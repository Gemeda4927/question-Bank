const express = require('express');
const morgan = require('morgan');
const path = require('path');

// ================== IMPORT ROUTERS ==================
const userRouter = require('./routes/user.routes');
const universityRouter = require('./routes/university.routes');
const collegeRouter = require('./routes/college.routes');      
const facultyRouter = require('./routes/faculty.routes');     
const examRouter = require('./routes/exam.routes');
const departmentRouter = require('./routes/department.routes');
const programRouter = require('./routes/program.routes');
const courseRouter = require('./routes/course.routes');
const paymentRouter = require('./routes/payment.routes');

const app = express();

// ================== MIDDLEWARES ==================
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
}

// ================== ROUTES ==================
app.use('/api/v1/users', userRouter);
app.use('/api/v1/universities', universityRouter);
app.use('/api/v1/colleges', collegeRouter);       
app.use('/api/v1/faculties', facultyRouter);      
app.use('/api/v1/exams', examRouter);
app.use('/api/v1/departments', departmentRouter);
app.use('/api/v1/programs', programRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/payments', paymentRouter); 

module.exports = app;
