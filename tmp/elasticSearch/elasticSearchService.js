const client = require("~/config/elasticsearch");

// Create an index in Elasticsearch
const createIndex = async (index) => {
    try {
        const { body } = await client.indices.create({
            index,
        });
        return body;
    } catch (error) {
        throw new Error(`Error creating index: ${error.message}`);
    }
};

// Delete an index in Elasticsearch
const deleteIndex = async (index) => {
    try {
        const { body } = await client.indices.delete({
            index,
        });
        return body;
    } catch (error) {
        throw new Error(`Error deleting index: ${error.message}`);
    }
};

// Insert a document into Elasticsearch
const insertDocument = async (index, id, body) => {
    try {
        const { body: responseBody } = await client.index({
            index,
            id,
            body,
        });
        return responseBody;
    } catch (error) {
        throw new Error(`Error inserting document: ${error.message}`);
    }
};

// Search for documents in Elasticsearch
const searchDocument = async (index, body) => {
    try {
        const { body: responseBody } = await client.search({
            index,
            body,
        });

        if (responseBody.hits.total.value === 0) {
            throw new Error("No hits found in the Elasticsearch response");
        }

        return responseBody;
    } catch (error) {
        console.error(`Error searching documents in ${index}:`, error.message);
        throw new Error(`Error searching documents: ${error.message}`);
    }
};

// Update an existing document in Elasticsearch
const updateDocument = async (index, id, body) => {
    try {
        const { body: responseBody } = await client.update({
            index,
            id,
            body: {
                doc: body,
            },
        });
        return responseBody;
    } catch (error) {
        throw new Error(`Error updating document: ${error.message}`);
    }
};

// Delete a document from Elasticsearch by ID
const deleteDocument = async (index, id) => {
    try {
        const { body: responseBody } = await client.delete({
            index,
            id,
        });
        return responseBody;
    } catch (error) {
        throw new Error(`Error deleting document: ${error.message}`);
    }
};

// Bulk insert documents into Elasticsearch
const bulkInsertDocuments = async (index, documents) => {
    try {
        const body = documents.flatMap((doc) => [
            { index: { _index: index, _id: doc.id } },
            doc.body,
        ]);

        const { body: responseBody } = await client.bulk({ body });
        return responseBody;
    } catch (error) {
        throw new Error(`Error bulk inserting documents: ${error.message}`);
    }
};

// Check if index exists in Elasticsearch
const indexExists = async (index) => {
    try {
        const { body } = await client.indices.exists({
            index,
        });
        return body;
    } catch (error) {
        throw new Error(`Error checking if index exists: ${error.message}`);
    }
};

module.exports = {
    createIndex,
    deleteIndex,
    insertDocument,
    searchDocument,
    updateDocument,
    deleteDocument,
    bulkInsertDocuments,
    indexExists,
};
