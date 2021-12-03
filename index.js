const dotenv = require("dotenv").config();

const express = require("express");
const server = express();
const multer = require("multer");

// const client = require("./db/client");
// client.connect();

const upload = multer({ dest: "public/images" });
const cors = require("cors");
server.use(cors());
server.use(express.static("public"));

server.use(express.json());
const jwt = require("jsonwebtoken");

const apiRouter = require("./api");
const { getUserByEmail } = require("./db/users");

//==========================================================

server.use(async (req, res, next) => {
  // console.log(req.headers.authorization);
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token) {
    return next();
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (decodedToken) {
    const user = await getUserByEmail(decodedToken.email);
    delete user.password;
    req.user = user;
    return next();
  }
});

server.use("/api", apiRouter);

//==========================================================

server.listen(process.env.PORT || 3000, () => {
  console.log("The server is up");
});
