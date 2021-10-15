const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const videoRouter = require("./routes/video");
const labelRouter = require("./routes/label");

const app = express();

app.use(express.json());
app.use(cors());
app.use(videoRouter);
app.use(labelRouter);

module.exports = app;
