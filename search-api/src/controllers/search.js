const prisma = require('../lib/prisma');

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: "models/text-embedding-004" });
const qdrantClient = new QdrantClient({ url: 'http://localhost:6333' });
const COLLECTION_NAME = 'auction_items';

async function generateEmbedding(text) {
    try {
        const embeddingResult = await model.embedContent(text);
        
        if (!embeddingResult || !embeddingResult.embedding || !embeddingResult.embedding.values) {
            throw new Error(`Invalid embedding result structure: ${JSON.stringify(embeddingResult)}`);
        }

        return embeddingResult.embedding.values;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}

async function performMongoSearch(q, limit) {
    // Using Prisma's findRaw for MongoDB text search
    const results = await prisma.auctionItem.findRaw({
        filter: {
            $text: { $search: q }
        },
        options: {
            limit: limit,
            projection: {
                _id: 1,
                title: 1,
                description: 1,
                start_price: 1,
                reserve_price: 1,
                score: { $meta: "textScore" }
            },
            sort: {
                score: { $meta: "textScore" }
            }
        }
    });

    return results.map(item => ({
        _id: item._id.$oid,
        title: item.title,
        description: item.description,
        start_price: item.start_price,
        reserve_price: item.reserve_price,
        score: item.score
    }));
}

async function performSemanticSearch(q, limit) {
    const mongoClient = new MongoClient(process.env.DATABASE_URL);
    
    try {
        const queryEmbedding = await generateEmbedding(q);
        console.log('Generated embedding length:', queryEmbedding.length);

        const searchResults = await qdrantClient.search(COLLECTION_NAME, {
            vector: queryEmbedding,
            limit: limit,
            with_payload: true
        });
        
        await mongoClient.connect();
        const collection = mongoClient.db().collection('auctionItems');
        
        const mongoIds = searchResults.map(r => new ObjectId(r.payload.mongo_id));
        const mongoDocuments = await collection.find({
            _id: { $in: mongoIds }
        }).toArray();

        const documentMap = new Map(
            mongoDocuments.map(doc => [doc._id.toString(), doc])
        );

        return searchResults
            .map(result => ({
                _id: result.payload.mongo_id,
                title: documentMap.get(result.payload.mongo_id).title,
                description: documentMap.get(result.payload.mongo_id).description,
                start_price: documentMap.get(result.payload.mongo_id).start_price,
                reserve_price: documentMap.get(result.payload.mongo_id).reserve_price,
                score: result.score
            }))
            .filter(item => item._id);

    } finally {
        await mongoClient.close();
    }
}

async function searchItems(req, res) {
    try {
        const { q, n, m } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({ 
                error: 'Missing search query',
                message: 'Please provide a valid search term using the "q" query parameter' 
            });
        }

        // Parse n as integer and validate, default to 10 if not provided or invalid
        const limit = parseInt(n) > 0 ? parseInt(n) : 10;
        
        // Determine search mode: 'mongo' for text search, 'semantic' (or default) for vector search
        const searchMode = m === 'mongo' ? 'mongo' : 'semantic';
        console.log(`Performing ${searchMode} search for query:`, q);

        const results = searchMode === 'mongo' 
            ? await performMongoSearch(q, limit)
            : await performSemanticSearch(q, limit);

        res.json({
            items: results,
            count: results.length,
            query: q,
            mode: searchMode
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}

module.exports = { searchItems };
