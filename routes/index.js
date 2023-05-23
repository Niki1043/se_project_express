const router = require("express").Router();
const user = require("./users");
const clothingItem = require("./clothingItems");
const NotFoundError = require("../errors/NotFoundError"); // Code404
// const { ID_NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateUserSignUpInfo,
  validateUserSignInInfo,
} = require("../middlewares/validation");

router.use("/users", auth, user);
router.use("/items", clothingItem);

router.post("/signin", validateUserSignInInfo, login);
router.post("/signup", validateUserSignUpInfo, createUser);

router.use(() => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
