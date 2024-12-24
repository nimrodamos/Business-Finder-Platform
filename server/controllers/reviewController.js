const Business = require("../models/businessModel");

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    // Find the business
    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Add the review
    const newReview = {
      userId: req.user.id,
      comment,
      createdAt: new Date(),
    };
    business.reviews.push(newReview);

    // Save the updated business
    await business.save();

    res.status(201).json({
      message: "Review added successfully",
      reviews: business.reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const { comment } = req.body;

    // Find the business
    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find the review
    const review = business.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Verify the owner of the review
    if (review.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this review" });
    }

    // Update the comment
    review.comment = comment;
    review.createdAt = new Date();

    // Save the updated business
    await business.save();

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    // Find the business
    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find the review
    const review = business.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Verify the owner of the review
    if (review.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    // Remove the review
    review.remove();

    // Save the updated business
    await business.save();

    res.status(200).json({
      message: "Review deleted successfully",
      reviews: business.reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
};
