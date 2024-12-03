const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    node: process.env.ELASTIC_URL,
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    },
    ssl: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
});

module.exports = client;
