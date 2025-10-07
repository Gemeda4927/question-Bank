// ====================== SERVER.JS ======================
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); // optional, install with `npm i colors`

// ====================== HANDLE SYNC ERRORS ======================
process.on('uncaughtException', (err) => {
  console.log('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.log(`${err.name}: ${err.message}`.red.bold);
  process.exit(1);
});

// ====================== LOAD ENVIRONMENT VARIABLES ======================
dotenv.config({ path: './config.env' });

// ====================== IMPORT APP ======================
const app = require('./app');

// ====================== MONGODB CONNECTION ======================
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Database connection successful!'.green))
  .catch((err) => {
    console.log('❌ Database connection failed:'.red, err.message);
  });

// ====================== START SERVER ======================
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 App running on port ${PORT} in ${process.env.NODE_ENV} mode`.cyan);
});

// ====================== HANDLE ASYNC ERRORS ======================
process.on('unhandledRejection', (err) => {
  console.log('💥 UNHANDLED REJECTION! Shutting down...');
  console.log(`${err.name}: ${err.message}`.red.bold);

  server.close(() => {
    process.exit(1);
  });
});

// ====================== OPTIONAL: GRACEFUL SHUTDOWN ON SIGTERM ======================
// Useful when deploying to cloud providers like Heroku
process.on('SIGTERM', () => {
  console.log('⚡ SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated!');
  });
});
