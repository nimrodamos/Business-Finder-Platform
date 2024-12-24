const express = require("express");
const {
  signup,
  login,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// Protected route
router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({ message: "Profile data", user: req.user });
});

// Update user route
router.put("/:id", authenticate, updateUser);

// Delete user
router.delete("/:id", authenticate, deleteUser);

module.exports = router;
