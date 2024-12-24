const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoutes = require("./routes/userRoutes");
const businessRoutes = require("./routes/businessRoutes");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Business Finder Platform API");
});

// Use user routes
app.use("/users", userRoutes);

//use busindes routes
app.use("/businesses", businessRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// MongoDB connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));
