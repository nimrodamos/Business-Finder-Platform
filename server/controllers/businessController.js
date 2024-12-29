const Business = require("../models/businessModel");
const { notifySubscribers } = require("../services/notificationService");

const createBusiness = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    console.log("Request received for creating business.");
    console.log("User ID:", req.user.id);
    console.log("User Plan:", req.user.plan);

    // Check if the user has permission to create more businesses
    const userBusinesses = await Business.find({ owner: req.user.id });
    const planLimits = {
      Standard: 1,
      Gold: 3,
      Platinum: 10,
    };

    if (userBusinesses.length >= planLimits[req.user.plan]) {
      return res
        .status(403)
        .json({ message: "Business creation limit reached for your plan." });
    }

    // Create new business
    const newBusiness = await Business.create({
      name,
      description,
      category,
      owner: req.user.id,
    });

    // Populate owner details (fetch name and email)
    const populatedBusiness = await newBusiness.populate("owner", "name email");

    res.status(201).json({
      message: "Business created successfully",
      business: populatedBusiness,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating business", error });
  }
};

const getBusinesses = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      ownerName,
      page = 1,
      limit = 10,
    } = req.query;

    // Handle search by ID
    if (id) {
      try {
        const business = await Business.findById(id).populate(
          "owner",
          "name email"
        );
        if (!business) {
          return res.status(404).json({ message: "Business not found" });
        }
        return res
          .status(200)
          .json({ message: "Business retrieved successfully", business });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Error retrieving business by ID", error });
      }
    }

    // Build the query object for filtering
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }

    if (description) {
      query.description = { $regex: description, $options: "i" }; // Case-insensitive search
    }

    // Optimize filtering by owner's name
    if (ownerName) {
      const owners = await User.find(
        { name: { $regex: ownerName, $options: "i" } },
        "_id"
      );
      query.owner = { $in: owners.map((owner) => owner._id) };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch businesses with filtering and pagination
    const businesses = await Business.find(query)
      .populate("owner", "name email")
      .skip(skip)
      .limit(Number(limit));

    // Fetch total count for pagination metadata
    const total = await Business.countDocuments(query);

    res.status(200).json({
      message: "Businesses retrieved successfully",
      businesses,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving businesses", error });
  }
};

const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    // Find the business
    const business = await Business.findById(id);
    if (!business) {
      console.log("Business not found");
      return res.status(404).json({ message: "Business not found" });
    }

    // Verify the owner
    console.log("Business owner:", business.owner);
    console.log("Current user:", req.user.id);
    if (business.owner.toString() !== req.user.id) {
      console.log("User is not authorized to update this business");
      return res
        .status(403)
        .json({ message: "You are not authorized to update this business" });
    }

    // Update fields
    if (name) business.name = name;
    if (description) business.description = description;
    if (category) business.category = category;

    // Save the updated business
    const updatedBusiness = await business.save();
    console.log("Business updated successfully:", updatedBusiness);

    // Notify subscribers about the update
    await notifySubscribers(
      updatedBusiness,
      `The business "${updatedBusiness.name}" has been updated.`
    );

    res.status(200).json({
      message: "Business updated successfully",
      business: updatedBusiness,
    });
  } catch (error) {
    console.error("Error updating business:", error);
    res
      .status(500)
      .json({ message: "Error updating business", error: error.message });
  }
};

const deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the business
    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Verify the owner
    if (business.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this business" });
    }

    // Notify subscribers about the deletion
    await notifySubscribers(
      business,
      `The business "${business.name}" has been deleted.`
    );

    // Delete the business
    await business.deleteOne();

    res.status(200).json({ message: "Business deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting business", error });
  }
};

const subscribeToBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the business
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Check if the user is already subscribed
    if (business.subscribers.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You are already subscribed to this business" });
    }

    // Add user to subscribers
    business.subscribers.push(req.user.id);
    await business.save();

    res
      .status(200)
      .json({ message: "Subscribed to business successfully", business });
  } catch (error) {
    res.status(500).json({ message: "Error subscribing to business", error });
  }
};

const unsubscribeFromBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the business
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Check if the user is subscribed
    if (!business.subscribers.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You are not subscribed to this business" });
    }

    // Remove user from subscribers
    business.subscribers = business.subscribers.filter(
      (subscriberId) => subscriberId.toString() !== req.user.id
    );
    await business.save();

    res
      .status(200)
      .json({ message: "Unsubscribed from business successfully", business });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error unsubscribing from business", error });
  }
};

module.exports = {
  createBusiness,
  getBusinesses,
  updateBusiness,
  deleteBusiness,
  subscribeToBusiness,
  unsubscribeFromBusiness,
};
