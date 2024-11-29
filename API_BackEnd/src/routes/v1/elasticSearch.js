const express = require('express');
const client = require('~/config/elasticsearch');

const router = express.Router();

router.post('/create-index', async (req, res) => {
    try {
        const response = await client.indices.create({
            index: 'products',
            body: {
                mappings: {
                    properties: {
                        name: { type: 'text' },
                        description: { type: 'text' },
                        category: { type: 'keyword' },
                        price: { type: 'float' },
                    },
                },
            },
        });
        res.status(200).json({ message: 'Index created', response });
    } catch (error) {
        res.status(500).json({ message: 'Error creating index', error });
    }
});

module.exports = router;
