const mongoose = require("mongoose");
require("dotenv").config();

async function connect() {
	try {
		console.log(`Connecting to MongoDB...${process.env.DB_URL}`);
		await mongoose.connect(process.env.DB_URL);
	} catch (error) {
		console.error("Connect failure!!!", error);
		process.exit(1);
	}
}

mongoose.connection.on("error", (error) => {
	console.error("MongoDB connection error:", error);
});

mongoose.connection.on("connected", () => {
	console.log("MongoDB is connected!");
});

mongoose.connection.on("disconnected", () => {
	console.log("MongoDB is disconnected!");
});

process.on("SIGINT", async () => {
	try {
		await mongoose.connection.close();
		console.log("MongoDB connection closed due to application termination");
		process.exit(0);
	} catch (error) {
		console.error("Error closing MongoDB connection:", error);
		process.exit(1);
	}
});

module.exports = { connect };
