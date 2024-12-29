const express = require("express");
const {
  signup,
  login,
  deleteUser,
  updateUser,
  upgradePlan,
  getLoggedUser,
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

router.get("/me", authenticate, getLoggedUser);

// Upgrade plan route
router.put("/upgrade", authenticate, upgradePlan);

// Update user route
router.put("/:id", authenticate, updateUser);

// Delete user
router.delete("/:id", authenticate, deleteUser);

module.exports = router;
