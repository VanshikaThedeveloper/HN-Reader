const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the URI from environment variables.
 * Exits the process on failure so the server doesn't start in a broken state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected!  ... `);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
  