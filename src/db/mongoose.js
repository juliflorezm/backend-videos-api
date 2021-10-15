const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOOSE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => console.log("connected to mongodb"));

module.exports = db;
