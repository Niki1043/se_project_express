const router = require("express").Router();
const user = require("./users");
const clothingItem = require("./clothingItems");
const { ID_NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use("/users", auth, user);
router.use("/items", clothingItem);

router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(ID_NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
