const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateIDs,
  validateAddClothingItemInfo,
} = require("../middlewares/validation");

// GET /items — returns all clothing items
router.get("/", getClothingItems);

// POST /items — creates a new item
router.post("/", auth, validateAddClothingItemInfo, createClothingItem);

// DELETE /items/:itemId — deletes an item by _id
router.delete("/:itemId", auth, validateIDs, deleteClothingItem);

// PUT /items/:itemId/likes — like an item
router.put("/:itemId/likes", auth, validateIDs, likeClothingItem);

// DELETE /items/:itemId/likes — unlike an item
router.delete("/:itemId/likes", auth, validateIDs, dislikeClothingItem);

module.exports = router;
