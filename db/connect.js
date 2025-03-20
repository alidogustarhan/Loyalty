const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const connectDB = async () => {
  const connectionString = process.env.MONGO_URI;

  if (!connectionString) {
    console.log('MONGO_URI tanımlı değil, veritabanına bağlanılmadı.');
    return;
  }

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};



module.exports = connectDB
