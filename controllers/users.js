// getUsers, getUser, and createUser
// get the models for user
const User = require("../models/user");
const {
  INVALID_DATA_ERROR,
  ID_NOT_FOUND,
  DEFAULT_ERROR,
  NO_DOCUMENTS_FOUND,
} = require("../utils/errors");

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
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "The data provided is invalid" });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};
