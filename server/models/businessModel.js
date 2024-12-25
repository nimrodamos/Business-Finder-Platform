const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Business", businessSchema);
