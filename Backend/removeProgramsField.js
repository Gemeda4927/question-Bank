// removeProgramsField.js
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

// ================== CONFIG ==================
const DB = process.env.DATABASE || process.env.MONGO_URI;

if (!DB) {
  console.error("❌ No DATABASE URI found. Please set DATABASE or MONGO_URI in your config.env file.");
  process.exit(1);
}

// ================== CONNECT TO DB ==================
async function run() {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB...");

    // ================== SCHEMA UPDATE ==================
    const University = mongoose.model(
      "University",
      new mongoose.Schema({}, { strict: false }) // allow removing any field
    );

    const result = await University.updateMany({}, { $unset: { programs: "" } });

    console.log(`🗑️ Removed "programs" field from ${result.modifiedCount} documents.`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

run();
