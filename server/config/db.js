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

    const conn = await mongoose.connect(uri);
    console.log("Mongo DB Connected:", conn.connection.host);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
