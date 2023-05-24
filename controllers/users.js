// getUsers, getUser, and createUser
// get the models for user
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET = "dev-secret" } = process.env;
const User = require("../models/user");

const BadRequestError = require("../errors/BadRequestError"); // Code400
const ConflictError = require("../errors/ConflictError"); // Code409
const NotFoundError = require("../errors/NotFoundError"); // Code404

// const JWT_SECRET = require("../utils/config");

// GetUsers Request - returns all users
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// GetUser Request - returns user by _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("User ID provided does not exist");
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// Post CreateUser Request - creates new user
module.exports.createUser = (req, res, next) => {
  // console.log(req.body);
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.send({ name, avatar, email, _id: user._id }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("The data provided is invalid"));
      } else if (err.code === 11000) {
        next(new ConflictError("A user with this email already exists"));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// login controller to create - get email and password and authenticate items
// findByCredentials()custommethod from classes
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("User ID provided does not exist");
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("User ID provided does not exist");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      // console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("The data provided is invalid"));
      } else {
        next(err);
      }
    });
};
