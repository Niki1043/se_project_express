// get the models for clothingitems
const Item = require("../models/clothingItem");
const {
  INVALID_DATA_ERROR,
  ID_NOT_FOUND,
  DEFAULT_ERROR,
  NO_DOCUMENTS_FOUND,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

// GET /items — returns all clothing items
module.exports.getClothingItems = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch(() => {
      res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST /items — creates a new item
module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  console.log(owner);
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.send({ data: item }))
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

// DELETE /items/:itemId — deletes an item by _id
module.exports.deleteClothingItem = (req, res) => {
  const owner = req.user._id;
  Item.findByIdAndDelete(req.params.itemId)
    .orFail(() => {
      throw NO_DOCUMENTS_FOUND;
    })
    .then((item) => {
      if (item.owner !== owner) {
        return res.status(FORBIDDEN_ERROR).send({
          message:
            "You do not have the appropriate permissions to delete this item",
        });
      }
      return item.deleteOne().then((item) => res.send({ data: item }));
    })
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

// PUT /items/:itemId/likes — like an item
module.exports.likeClothingItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
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

// DELETE /items/:itemId/likes — unlike an item
module.exports.dislikeClothingItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
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
