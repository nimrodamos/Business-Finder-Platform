const express = require("express");
const {
  createBusiness,
  getBusinesses,
  updateBusiness,
  deleteBusiness,
  subscribeToBusiness,
  unsubscribeFromBusiness,
} = require("../controllers/businessController");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Create business route
router.post("/", authenticate, createBusiness);

// Get all businesses route
router.get("/", getBusinesses);

// Update business route
router.put("/:id", authenticate, updateBusiness);

// Delete business route
router.delete("/:id", authenticate, deleteBusiness);

// Subscribe to a business route
router.post("/:id/subscribe", authenticate, subscribeToBusiness);

// Unsubscribe from a business route
router.delete("/:id/unsubscribe", authenticate, unsubscribeFromBusiness);

module.exports = router;
