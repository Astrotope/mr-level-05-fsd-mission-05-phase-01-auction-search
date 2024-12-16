require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    // Try to connect and perform a simple query
    const result = await prisma.auctionItem.findFirst();
    console.log('Connection successful!');
    console.log('Sample data:', result);
  } catch (error) {
    console.error('Connection failed:', error);
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();