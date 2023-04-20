const router = require("express").Router();
const user = require("./users");
const clothingItem = require("./clothingItems");
const { ID_NOT_FOUND } = require("../utils/errors");

router.use("/users", user);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(ID_NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
