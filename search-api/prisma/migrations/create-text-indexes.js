const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createIndexes() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    
    // Create text indexes
    await db.collection('auctionItems').createIndex({
      title: "text",
      description: "text"
    });
    
    console.log('Text indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    await client.close();
  }
}

createIndexes();