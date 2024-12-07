const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');

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

client
    .ping()
    .then(() => {
        console.info('Elasticsearch connected');
    })
    .catch((err) => {
        console.error('Elasticsearch disconnected', err);
    });

module.exports = client;
