// get the models for clothingitems
const Item = require("../models/clothingItem");

const BadRequestError = require("../errors/BadRequestError"); //Code400
const NotFoundError = require("../errors/NotFoundError"); //Code404
const ForbiddenError = require("../errors/ForbiddenError"); //Code403

// GET /items — returns all clothing items
module.exports.getClothingItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch(next);
};

// POST /items — creates a new item
module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  //console.log(owner);
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      // console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("The data provided is invalid"));
      } else {
        next(err);
      }
    });
};

// DELETE /items/:itemId — deletes an item by _id
module.exports.deleteClothingItem = (req, res, next) => {
  const owner = req.user._id;
  Item.findById(req.params.itemId)
    .orFail(() => {
      throw new NotFoundError("Item ID provided does not exist");
    })
    .then((item) => {
      if (String(item.owner) !== owner) {
        return next(
          new ForbiddenError(
            "You do not have the appropriate permissions to delete this item"
          )
        );
      }
      return item.deleteOne().then(() => res.send({ data: item }));
    })
    .catch(next);
};

// PUT /items/:itemId/likes — like an item
module.exports.likeClothingItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item ID provided does not exist");
    })
    .then((item) => res.send({ data: item }))
    .catch(next);
};

// DELETE /items/:itemId/likes — unlike an item
module.exports.dislikeClothingItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item ID provided does not exist");
    })
    .then((item) => res.send({ data: item }))
    .catch(next);
};
