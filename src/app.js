require('express-async-errors')

const express = require("express");
const routes = require("./routes");
const AppError = require("./utils/AppError");
const sqliteConnection = require('./database/sqlite');

const app = express();

app.use(express.json());
app.use(routes);

sqliteConnection();

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.log(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = 3330;
app.listen(PORT, () => {
  console.log("SERVER IS RUNNING ON PORT " + PORT);
});
