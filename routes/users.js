const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

// router definitions
// GET /users — returns all users
// router.get("/", getUsers);
// GET /users/:userId - returns a user by _id
// router.get("/:id", getUser);
// POST /users — creates a new user
// router.post("/", createUser);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
