const app = require("./app");

const port = process.env.SERVER_PORT;

const server = app.listen(port, () => {
  console.log("server is running on port " + port);
});

module.exports = server;
