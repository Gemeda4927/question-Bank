// simple-migration.js
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

const simpleMigration = async () => {
  try {
    const MONGODB_URI = process.env.DATABASE;
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Connected to MongoDB');
    
    // Get the raw collection
    const db = mongoose.connection.db;
    const universitiesCollection = db.collection('universities');
    
    // Find all documents with programs field
    const universities = await universitiesCollection.find({ 
      programs: { $exists: true } 
    }).toArray();
    
    console.log(`📊 Found ${universities.length} universities with programs field`);
    
    for (const uni of universities) {
      console.log(`🔄 Processing: ${uni.name}`);
      
      // Add departments field with programs data
      await universitiesCollection.updateOne(
        { _id: uni._id },
        { 
          $set: { 
            departments: uni.programs 
          } 
        }
      );
      
      console.log(`✅ Added departments to: ${uni.name}`);
    }
    
    console.log('🎉 Migration completed!');
    
    // Optional: Remove programs field
    console.log('🗑️ Removing programs field...');
    const removeResult = await universitiesCollection.updateMany(
      { programs: { $exists: true } },
      { $unset: { programs: "" } }
    );
    
    console.log(`🗑️ Removed programs field from ${removeResult.modifiedCount} documents`);
    
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

simpleMigration();
