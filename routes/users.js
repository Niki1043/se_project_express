const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");

// router definitions
// GET /users — returns all users
// router.get("/", getUsers);
// GET /users/:userId - returns a user by _id
// router.get("/:id", getUser);
// POST /users — creates a new user
// router.post("/", createUser);
router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
