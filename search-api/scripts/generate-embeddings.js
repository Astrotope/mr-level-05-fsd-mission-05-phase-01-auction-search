// scripts/generate-embeddings.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const COLLECTION_NAME = 'auction_items';
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: "models/text-embedding-004" });

async function generateEmbedding(text) {
    try {
        console.log('Generating embedding for text:', text);
        const embeddingResult = await model.embedContent(text);
        
        if (!embeddingResult || !embeddingResult.embedding || !embeddingResult.embedding.values) {
            throw new Error(`Invalid embedding result structure: ${JSON.stringify(embeddingResult)}`);
        }

        const values = embeddingResult.embedding.values;
        
        if (!Array.isArray(values)) {
            throw new Error(`Embedding values is not an array: ${typeof values}`);
        }

        console.log('Extracted embedding length:', values.length);
        return values;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}

async function processItems() {
    const mongoClient = new MongoClient(process.env.DATABASE_URL);
    const qdrantClient = new QdrantClient({ url: 'http://localhost:6333' });
    let successCount = 0;

    try {
        console.log('Connecting to MongoDB...');
        await mongoClient.connect();
        const collection = mongoClient.db().collection('auctionItems');
        const items = await collection.find({}).toArray();
        console.log(`Found ${items.length} items in MongoDB`);

        for (const item of items) {
            try {
                // Combine title and description for embedding
                const text = `${item.title} ${item.description}`;
                const embedding = await generateEmbedding(text);
                console.log('Generated embedding length:', embedding.length);

                // Generate a UUID for the Qdrant point ID
                const pointId = uuidv4();

                // Insert into Qdrant with MongoDB ID in payload
                await qdrantClient.upsert(COLLECTION_NAME, {
                    wait: true,
                    points: [{
                        id: pointId,
                        vector: embedding,
                        payload: {
                            mongo_id: item._id.toString()
                        }
                    }]
                });

                successCount++;
                console.log(`Successfully processed: ${item._id} - ${item.title}`);
            } catch (error) {
                console.error(`Error processing item ${item._id}:`, error);
            }
        }

        // Get collection info
        const info = await qdrantClient.getCollection(COLLECTION_NAME);
        
        console.log('\nProcessing complete:');
        console.log(`- Total items processed: ${items.length}`);
        console.log(`- Successfully processed: ${successCount}`);
        console.log(`- Collection info:`, info);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoClient.close();
    }
}

processItems();
