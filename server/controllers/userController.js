const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Signup logic
const signup = async (req, res) => {
  try {
    const { name, email, password, plan } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      plan,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
};

// Login logic
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, plan } = req.body;

    // Hash password if it needs to be updated
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(password && { password: hashedPassword }),
        ...(plan && { plan }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

const upgradePlan = async (req, res) => {
  try {
    const { plan } = req.body;

    const allowedPlans = ["Standard", "Gold", "Platinum"];
    if (!allowedPlans.includes(plan)) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.plan === plan) {
      return res.status(400).json({ message: "You are already on this plan" });
    }

    user.plan = plan;
    await user.save();

    res
      .status(200)
      .json({ message: "Plan upgraded successfully", plan: user.plan });
  } catch (error) {
    res.status(500).json({ message: "Error upgrading plan", error });
  }
};

module.exports = { signup, login, updateUser, deleteUser, upgradePlan };
