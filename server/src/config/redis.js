const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
});

const connectToRedis = async () => {
	try {
		await client.connect();
		const result = await client.ping();
		console.log("Redis ping response:", result);
	} catch (err) {
		console.error("Error connecting to Redis:", err);
	}
};

connectToRedis();

client.on("error", (err) => {
	console.error("Redis error:", err);
});

client.on("ready", () => {
	console.log("Redis is ready");
});

const setAsync = async (key, value, options) =>
	await client.set(key, value, options);

const getAsync = async (key) => await client.get(key);
const delAsync = async (key) => await client.del(key);

module.exports = { client, setAsync, getAsync, delAsync };
