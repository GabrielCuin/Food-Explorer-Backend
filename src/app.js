require("express-async-errors");
require("dotenv/config");

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const AppError = require("./utils/AppError");
const sqliteConnection = require("./database/sqlite");
const uploadConfig = require("./config/upload");

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

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

const PORT = process.env.PORT || 3330;
app.listen(PORT, () => {
  console.log("SERVER IS RUNNING ON PORT " + PORT);
});
