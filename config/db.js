const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log(`DB Connected to ${conn.connection.host}`.cyan.underline.bold);
  } catch (err) {
    console.error(`DB connection failed with error: ${err}`.red.bold);
  }
};

module.exports = connectDb;
