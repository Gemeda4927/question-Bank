const express = require("express")
const morgan = require("morgan")
const path = require("path")
const cors = require("cors")

// ================== IMPORT ROUTERS ==================
const userRouter = require("./routes/user.routes")
const universityRouter = require("./routes/university.routes")
const collegeRouter = require("./routes/college.routes")
const facultyRouter = require("./routes/faculty.routes")
const examRouter = require("./routes/exam.routes")
const departmentRouter = require("./routes/department.routes")
const programRouter = require("./routes/program.routes")
const courseRouter = require("./routes/course.routes")
const paymentRouter = require("./routes/payment.routes")
const questionRouter = require("./routes/question.routes")

const app = express()

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// ================== API ROUTES ==================
app.use("/api/v1/users", userRouter)
app.use("/api/v1/universities", universityRouter)
app.use("/api/v1/colleges", collegeRouter)
app.use("/api/v1/faculties", facultyRouter)
app.use("/api/v1/exams", examRouter)
app.use("/api/v1/departments", departmentRouter)
app.use("/api/v1/programs", programRouter)
app.use("/api/v1/courses", courseRouter)
app.use("/api/v1/payments", paymentRouter)
app.use("/api/v1/questions", questionRouter)

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

module.exports = app
