const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uriRaw = process.env.MONGODB_URI;
    if (!uriRaw) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    const uri =
      process.env.DATABASE_PASSWORD && uriRaw.includes("<PASSWORD>")
        ? uriRaw.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
        : uriRaw;

    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(uri);
    console.log("MongoDB Connected:", conn.connection.host);
    console.log("Database Name:", conn.connection.name);
    console.log("Connection State:", mongoose.connection.readyState === 1 ? "Connected" : "Not Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
