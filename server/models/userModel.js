const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: {
    type: String,
    enum: ["Standard", "Gold", "Platinum"],
    default: "Standard",
  },
  savedBusinesses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Business" }],
});

module.exports = mongoose.model("User", userSchema);
