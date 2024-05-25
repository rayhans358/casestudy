const mongoose = require("mongoose");
const { dbUser, dbPass, dbHost, dbName } = require("../root/config");

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`
);

const db = mongoose.connection;

module.exports = db;
