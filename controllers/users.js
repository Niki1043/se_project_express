// getUsers, getUser, and createUser
// get the models for user
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  INVALID_DATA_ERROR,
  ID_NOT_FOUND,
  DEFAULT_ERROR,
  NO_DOCUMENTS_FOUND,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");
const JWT_SECRET = require("../utils/config");

// GetUsers Request - returns all users
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// GetUser Request - returns user by _id
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw NO_DOCUMENTS_FOUND;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "The id provided is invalid" });
      } else if (err.name === "NotFoundError") {
        res
          .status(ID_NOT_FOUND)
          .send({ message: "The id provided was not found" });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// Post CreateUser Request - creates new user
module.exports.createUser = (req, res) => {
  console.log(req.body);
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.send({ name, avatar, email, _id: user._id }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "The data provided is invalid" });
      } else if (err.code === 11000) {
        res
          .status(CONFLICT_ERROR)
          .send({ message: "A user with this email already exists" });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// login controller to create - get email and password and authenticate items
// findByCredentials()custommethod from classes
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw NO_DOCUMENTS_FOUND;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "The id provided is invalid" });
      } else if (err.name === "NotFoundError") {
        res
          .status(ID_NOT_FOUND)
          .send({ message: "The id provided was not found" });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "The id provided is invalid" });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(ID_NOT_FOUND)
          .send({ message: "The id provided was not found" });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};
