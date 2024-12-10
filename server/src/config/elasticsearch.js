const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

const client = new Client({
	node: process.env.ELASTIC_URL,
	auth: {
		username: process.env.ELASTIC_USERNAME,
		password: process.env.ELASTIC_PASSWORD,
	},
});

const connectToElasticsearch = async () => {
	try {
		const result = await client.ping();
		console.log("Elasticsearch ping response:", result);
	} catch (err) {
		console.error("Error connecting to Elasticsearch:", err);
	}
};

connectToElasticsearch();

module.exports = client;
