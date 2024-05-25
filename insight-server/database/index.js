const mongoose = require("mongoose");
const { dbUser, dbPass, dbHost, dbName } = require("../app/config");

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 500000,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const db = mongoose.connection;

module.exports = db;
