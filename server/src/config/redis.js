const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

const connectToRedis = async () => {
    try {
        await client.connect();

        const result = await client.ping();
        console.log('Redis ping response:', result);
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
};

client.on('error', (err) => {
    console.error('Redis error:', err);
});

client.on('ready', () => {
    console.log('Redis is ready');
});

const setAsync = async (key, value, options) =>
    await client.set(key, value, options);

const getAsync = async (key) => await client.get(key);
const delAsync = async (key) => await client.del(key);

connectToRedis();
module.exports = { client, setAsync, getAsync, delAsync };
