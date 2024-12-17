// scripts/setup-qdrant.js
const { QdrantClient } = require('@qdrant/js-client-rest');
require('dotenv').config();

const COLLECTION_NAME = 'auction_items';
const VECTOR_DIM = 768; // dimension for text-embedding-004

async function setupQdrant() {
    const client = new QdrantClient({ url: 'http://localhost:6333' });

    try {
        // Delete collection if exists
        try {
            await client.deleteCollection(COLLECTION_NAME);
        } catch (e) {
            // Collection might not exist, that's ok
        }

        // Create collection
        await client.createCollection(COLLECTION_NAME, {
            vectors: {
                size: VECTOR_DIM,
                distance: 'Cosine'
            }
        });

        // Create payload index for mongo_id
        await client.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'mongo_id',
            field_schema: 'keyword'
        });

        console.log('Qdrant collection setup complete!');
    } catch (error) {
        console.error('Error setting up Qdrant:', error);
        throw error;
    }
}

setupQdrant();