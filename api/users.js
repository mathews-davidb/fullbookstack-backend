const usersRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  getUser,
  createUser,
  getUserByEmail,
  getAllUsers,
} = require("../db/users");
const { createOrder } = require("../db/orders");

//==========================================================

usersRouter.post("/register", async (req, res, next) => {
  const { email, name, password } = req.body;
  try {
    if (!email || !name || !password) {
      res.status(401);
      return next({ error: "Register Error: Missing login input" });
    }
    if (password.length < 8) {
      res.status(401);
      return next({
        error: "Register Error: Password must be at least 8 characters",
      });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(401);
      return next({
        error: "Register Error: Account already exists",
      });
    }

    const newUser = await createUser({ email, name, password });
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    console.log(newUser);
    createOrder(newUser.id);
    res.send({ user: newUser, token });
  } catch (error) {
    throw error;
  }
});

//==========================================================

usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401);
    next({
      error:
        "Missing Credentials Error: Please supply both an email and password",
    });
  }
  try {
    const user = await getUser({ email, password });
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.send({ message: "you're logged in!", token: token });
  } catch (error) {
    res
      .status(401)
      .send({ error: "Bad Credentials: Email or password is incorrect" });
  }
});

//==========================================================

usersRouter.get("/me", (req, res) => {
  if (req.user) {
    return res.send(req.user);
  }
  res.status(401).send("Not logged in!");
});

//==========================================================

usersRouter.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (error) {
    res.status(401).send("Not logged in!");
  }
});

//==========================================================

module.exports = usersRouter;
