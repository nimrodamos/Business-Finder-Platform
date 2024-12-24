const express = require("express");
const {
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Add a review to a business
router.post("/:id/review", authenticate, addReview);

// Update a review
router.put("/:id/review/:reviewId", authenticate, updateReview);

// Delete a review
router.delete("/:id/review/:reviewId", authenticate, deleteReview);

module.exports = router;
