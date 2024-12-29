const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const businessRoutes = require("./routes/businessRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // דומיין ה-Frontend שלך
    credentials: true, // מאפשר שליחת קוקיז
  })
);

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Business Finder Platform API");
});

// Use user routes
app.use("/users", userRoutes);

//use busindes routes
app.use("/businesses", businessRoutes);

// Use reviews routs
app.use("/reviews", reviewRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// MongoDB connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));
