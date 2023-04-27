const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

// GET /items — returns all clothing items
router.get("/", getClothingItems);

// POST /items — creates a new item
router.post("/", auth, createClothingItem);

// DELETE /items/:itemId — deletes an item by _id
router.delete("/:itemId", auth, deleteClothingItem);

// PUT /items/:itemId/likes — like an item
router.put("/:itemId/likes", auth, likeClothingItem);

// DELETE /items/:itemId/likes — unlike an item
router.delete("/:itemId/likes", auth, dislikeClothingItem);

module.exports = router;
