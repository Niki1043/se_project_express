const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");

// GET /items — returns all clothing items
router.get("/", getClothingItems);

// POST /items — creates a new item
router.post("/", createClothingItem);

// DELETE /items/:itemId — deletes an item by _id
router.delete("/:itemId", deleteClothingItem);

// PUT /items/:itemId/likes — like an item
router.put("/:itemId/likes", likeClothingItem);

// DELETE /items/:itemId/likes — unlike an item
router.delete("/:itemId/likes", dislikeClothingItem);

module.exports = router;
