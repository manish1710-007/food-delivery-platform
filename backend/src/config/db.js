const mongoose = require("mongoose");

// DATABASE UPLINK INITIALIZATION
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from environment variables.");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[SYS.DB] MongoDB Mainframe connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[SYS.FATAL] MongoDB Connection Failed:`, err.message);
    process.exit(1); 
  }
};

// CONTINUOUS HEARTBEAT MONITORING
mongoose.connection.on('disconnected', () => {
  console.warn('[SYS.WARN] MongoDB Mainframe disconnected! Awaiting auto-reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('[SYS.ERR] MongoDB Connection Error detected:', err);
});

module.exports = connectDB;