const mongoose = require("mongoose");

const loyaltySchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	pointsEarned: Number,
	pointsRedeemed: Number,
	lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Loyalty", loyaltySchema);
