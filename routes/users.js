const express = require("express");
const {
  createUser,
  getUsers,
  signup,
  signin,
  deleteUser,
  getProfile,
} = require("../controllers/users");
const { requireSignin } = require("../middlewares/auth.js");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", signin);
router.post("/", createUser);
router.get("/", getUsers);
router.get("/profile", requireSignin, getProfile);
router.delete("/:id", deleteUser);

module.exports = router;
