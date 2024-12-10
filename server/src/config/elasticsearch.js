const { Client } = require("@elastic/elasticsearch");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
	node: process.env.ELASTIC_URL,
	auth: {
		username: process.env.ELASTIC_USERNAME,
		password: process.env.ELASTIC_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false, // Use with caution in production
	},
});

client
	.ping()
	.then(() => {
		console.info("Elasticsearch connected");
	})
	.catch((err) => {
		console.error("Elasticsearch disconnected", err);
		process.exit(1); // Stop execution if connection fails
	});

// Create index 'products' if it does not exist
client.indices
	.exists({ index: "products" })
	.then((exists) => {
		if (!exists.body) {
			// Create the index only if it doesn't exist
			client.indices
				.create({
					index: "products",
				})
				.then(() => {
					console.info("Index 'products' created");
				})
				.catch((createErr) => {
					if (
						createErr.meta.body.error.type ===
						"resource_already_exists_exception"
					) {
						console.info("Index 'products' already exists, no need to create.");
					} else {
						console.error("Failed to create index 'products'", createErr);
					}
				});
		} else {
			console.info("Index 'products' already exists, skipping creation.");
		}
	})
	.catch((err) => {
		console.error("Error checking index existence", err);
	});

module.exports = client;
