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
		rejectUnauthorized: false,
	},
});

const connectToElastic = async () => {
	let attempts = 0;
	const maxAttempts = 5;
	const delay = 5000;

	while (attempts < maxAttempts) {
		try {
			await client.ping();
			console.info("Elasticsearch connected");
			return;
		} catch (err) {
			attempts += 1;
			console.error(
				`Attempt ${attempts}: Elasticsearch connection failed`,
				err.message,
			);
			if (attempts >= maxAttempts) {
				console.error("Max attempts reached. Exiting...");
				process.exit(1);
			}
			console.info(`Retrying in ${delay / 1000} seconds...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
};

connectToElastic();

module.exports = client;