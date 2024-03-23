require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/indexRouter");
var usersRouter = require("./routes/usersRouter");
var documentsRouter = require("./routes/documentsRouter");
const authMiddleware = require("./middlewares/auth/authenticated");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/documents", authMiddleware, documentsRouter);

// error handling middleware
app.use((err, req, res, next) => {
  // other errors
  if (err.code === "INVALID_INPUT") {
    return res.status(422).json(err.message);
  }
  return res.status(500).json(err.message);
});

module.exports = app;
