require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const usersRouter = require("./routes/usersRouter");
const documentsRouter = require("./routes/documentsRouter");
const authMiddleware = require("./middlewares/auth/authenticated");
const guestMiddleware = require("./middlewares/auth/guest");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// if only in production then an only hosting react client app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "dist")));
}

// serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/users", guestMiddleware, usersRouter);
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
