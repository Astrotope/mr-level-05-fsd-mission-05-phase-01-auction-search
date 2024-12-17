# Testing Log - Auction Search API's

---

### Step 01 - Create ToDos

- Environment Variables

```bash
MONGO_USERNAME=admin
MONGO_PASSWORD=password
MONGO_DATABASE=auction
MONGO_PORT=27017
MONGO_URI=mongodb://localhost:27017
DB_NAME=auction
COLLECTION_NAME=auctionItems
```

- package.json - Jest Config

```bash
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.1.9",
    "supertest": "^7.0.0"
  }
```

- Test Code - search.test.js

```javascript
// test/search.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Search API', () => {

  test.todo('should search items by query');
  test.todo('should return 400 if query is missing');
  test.todo('should search in both title and description');

});
```

- Test Run

```bash
npm test

> search-api@1.0.0 test
> jest

 PASS  test/search.test.js
  Search API
    ✎ todo should search items by query
    ✎ todo should return 400 if query is missing
    ✎ todo should search in both title and description

Test Suites: 1 passed, 1 total
Tests:       3 todo, 3 total
Snapshots:   0 total
Time:        0.822 s
Ran all test suites.
```

---

### Step 02 - Create First Test & Failing Code for First Method

Built basic express server setup for auction search API

- Folder Structure

```bash
search-api/
├── src/
│   ├── app.js           # Express app setup
│   ├── server.js        # Server entry point
│   ├── routes/
│   │   └── apiRoutes.js # Search routes
│   └── controllers/
│       └── search.js    # Search logic
├── test/
│   └── search.test.js   # API tests
├── .env
└── package.json
```

- ./src/server.js

```javascript
// src/server.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
``` 

- ./src/app.js

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/apiRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', searchRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

module.exports = app;
```

- ./src/routes/apiRoutes.js

```javascript
// src/routes/apiRoutes.js
const express = require('express');
const { searchItems } = require('../controllers/search');

const router = express.Router();

router.get('/search', searchItems);

module.exports = router;
```

- ./src/controllers/search.js

```javascript
// src/controllers/search.js
async function searchItems(req, res) {
  res.json({});
}

module.exports = { searchItems };
```   

- ./test/search.test.js

```javascript
// test/search.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Search API', () => {

  test('should search items by query', async () => {
    const response = await request(app)
      .get('/api/search')
      .query({ q: 'wooden' });

    expect(response.status).toBe(200);
    expect(response.body.items).toBeDefined();
    expect(response.body.items.length).toBe(1);
    expect(response.body.items[0].title).toContain('Wooden');
  });
  
  test.todo('should return 400 if query is missing');
  test.todo('should search in both title and description');

});
``` 
- Test Run

```bash
npm test

> search-api@1.0.0 test
> jest

 FAIL  test/search.test.js
  Search API
    ✕ should search items by query (33 ms)
    ✎ todo should return 400 if query is missing
    ✎ todo should search in both title and description

  ● Search API › should search items by query

    expect(received).toBeDefined()

    Received: undefined

      11 |
      12 |     expect(response.status).toBe(200);
    > 13 |     expect(response.body.items).toBeDefined();
         |                                 ^
      14 |     expect(response.body.items.length).toBe(1);
      15 |     expect(response.body.items[0].title).toContain('Wooden');
      16 |   });

      at Object.toBeDefined (test/search.test.js:13:33)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 todo, 3 total
Snapshots:   0 total
Time:        0.653 s, estimated 2 s
Ran all test suites.
```

---

### Step 03 - Create Passing Code for First Method

- Folder Structure - With Prisma ODM added

```bash
auction-search/
├── search-api/                # Main API directory
│   ├── .env                   # Environment variables for configuration
│   ├── package.json           # Project metadata and dependencies
│   ├── prisma/                # Prisma ORM configuration
│   │   ├── migrations/         # Directory for database migrations
│   │   │   └── create-text-indexes.js # Script to create text indexes
│   │   └── schema.prisma      # Prisma schema definition
│   ├── scripts/               # Directory for utility scripts
│   │   └── test-connection.js # Script to test database connection
│   ├── src/                   # Source code for the API
│   │   ├── app.js             # Express app setup
│   │   ├── controllers/       # Controller functions for handling requests
│   │   │   └── search.js      # Search controller with search logic
│   │   ├── lib/               # Library files
│   │   │   └── prisma.js      # Prisma client instance
│   │   ├── routes/            # API route definitions
│   │   │   └── apiRoutes.js   # Routes for search functionality
│   │   └── server.js          # Entry point for the server
│   └── test/                  # Directory for tests
│       └── search.test.js     # Unit tests for the search API
└── README.md                  # Project documentation and overview
```

- Environment Variables

```bash
MONGO_USERNAME=admin
MONGO_PASSWORD=password
MONGO_DATABASE=auction
MONGO_PORT=27017
MONGO_URI=mongodb://localhost:27017
DB_NAME=auction
COLLECTION_NAME=auctionItems
PORT=3337
DATABASE_URL="mongodb://admin:password@localhost:27017/auction?authSource=admin"
```

- package.json - Jest Config

```bash
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "create-indexes": "node prisma/migrations/create-text-indexes.js",
    "test-connection": "node scripts/test-connection.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "^6.0.1",
    "body-parser": "^1.20.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "mongodb": "^6.12.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.1.9",
    "prisma": "^6.0.1",
    "supertest": "^7.0.0"
  }
```

- Script - Add Indexes

```bash
npm run create-indexes
```

- prisma/migrations/create-text-indexes.js

```javascript
// prisma/migrations/create-text-indexes.js
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
```

- Script - Test Connection

```bash
npm run test-connection
```

- scripts/test-connection.js

```javascript
// scripts/test-connection.js
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
```

- Create Prisma Client

```javascript
// src/lib/prisma.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
```

- Method Code - ./src/controllers/search.js

```javascript
// src/controllers/search.js
const prisma = require('../lib/prisma');

async function searchItems(req, res) {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        error: 'Missing search query',
        message: 'Please provide a search term using the "q" query parameter' 
      });
    }

    // Using Prisma's findRaw to execute MongoDB text search
    const items = await prisma.auctionItem.findRaw({
      filter: {
        $text: {
          $search: q
        }
      },
      options: {
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

    res.json({ 
      items,
      count: items.length,
      query: q
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      message: error.message 
    });
  }
}

module.exports = { searchItems };
``` 

- Test Code - ./test/search.test.js

```javascript
// test/search.test.js
// test/search.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Search API', () => {

  test('should search items by query', async () => {
    const response = await request(app)
      .get('/api/search')
      .query({ q: 'wooden' });

    console.log('Response JSON:', response.body); // Log the response body
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(typeof response.body.count).toBe('number');
    expect(response.body.query).toBe('wooden');
  });
  
  test.todo('should return 400 if query is missing');
  test.todo('should search in both title and description');

});
```

- Test Run

```bash
npm test


> search-api@1.0.0 test
> jest

  console.log
    Response JSON: {
      items: [
        {
          _id: [Object],
          title: 'Vintage Wooden Table',
          description: 'A beautifully crafted wooden table, perfect for your dining room.',
          start_price: 50,
          reserve_price: 100,
          score: 1.2380952380952381
        }
      ],
      count: 1,
      query: 'wooden'
    }

      at Object.log (test/search.test.js:12:13)

 PASS  test/search.test.js
  Search API
    ✓ should search items by query (86 ms)
    ✎ todo should return 400 if query is missing
    ✎ todo should search in both title and description

Test Suites: 1 passed, 1 total
Tests:       2 todo, 1 passed, 3 total
Snapshots:   0 total
Time:        5.186 s
Ran all test suites.
```

---

### Step 04 - Update Jest Test Suite - Add ToDo's for all primary feature, additional features, and edge cases for features

- Setup Commands

```bash 
# Spin up MongoDB, create database and collection, and seed data
cd cli-tool
docker compose up -d # Spin up MongoDB
node src/seed.js -f datasets/auction-items.json --verbose # Seed MongoDB

# run tests
npm test # Run tests
cd ..

# Spin up Qdrant, setup Qdrant collection, generate embeddings
cd search-api
docker compose up -d # Spin up Qdrant
npm run create-indexes # Create text indexes in MongoDB
npm run setup-qdrant # Setup Qdrant collection
npm run generate-embeddings # Generate aution item embeddings in Qdrant using Google Generative AI text-embedding-004 model

# Run tests and start server
npm test # Run tests
npm start # Start the server
```

- Jest Test Cases

```bash
    Basic Search Functionality
      ✓ should search items by query (1565 ms)
      ✓ should return 400 if query is missing (6 ms)
      ✓ should search in both title and description (1107 ms)
    Search Mode Tests
      ✓ should default to semantic search when m parameter is not provided (455 ms)
      ✓ should use semantic search when m=semantic (654 ms)
      ✓ should use MongoDB text search when m=mongo (52 ms)
      ✓ should use semantic search for invalid m parameter values (392 ms)
      ✓ should return correct mode in response for semantic search (1101 ms)
      ✓ should return correct mode in response for mongo search (15 ms)
    Result Limit Tests
      ✓ should default to 10 results when n parameter is not provided (810 ms)
      ✓ should limit results to n items when n is a valid positive number (381 ms)
      ✓ should default to 10 results when n is zero (746 ms)
      ✓ should default to 10 results when n is negative (409 ms)
      ✓ should default to 10 results when n is not a number (384 ms)
      ✓ should handle large n values gracefully (440 ms)
      ✓ should return correct count matching actual results length (1985 ms)
    Edge Cases
      ✓ should handle empty string query (4 ms)
      ✓ should handle very long queries (454 ms)
      ✓ should handle special characters in queries (2049 ms)
      ✓ should handle queries with only numbers (1641 ms)
      ✓ should handle queries with only spaces (2 ms)
      ✓ should handle multiple concurrent requests (1303 ms)
    Combined Parameter Tests
      ✓ should correctly combine m and n parameters for semantic search (439 ms)
      ✓ should correctly combine m and n parameters for mongo search (8 ms)
      ✓ should maintain consistent result format between search modes (394 ms)
      ✓ should include similarity scores in both search modes (1218 ms)
    Performance Tests
      ✎ todo should respond within acceptable time limit for semantic search
      ✎ todo should respond within acceptable time limit for mongo search
      ✎ todo should handle large result sets efficiently
    Error Handling
      ✎ todo should handle database connection errors gracefully
      ✎ todo should handle Qdrant connection errors gracefully
      ✎ todo should handle embedding generation errors gracefully
      ✎ todo should return appropriate error messages for each failure case
      ✎ todo should not expose internal error details in response
    Security Tests
      ✎ todo should sanitize query parameters to prevent injection
      ✎ todo should handle malformed query parameters safely
      ✎ todo should validate and sanitize n parameter
      ✎ todo should validate and sanitize m parameter
```

- Test Results

```bash
npm test

> search-api@1.0.0 test
> jest

[Lots of console logging]...

 PASS  test/search.test.js (23.745 s)
  Search API
    Basic Search Functionality
      ✓ should search items by query (1545 ms)
      ✓ should return 400 if query is missing (4 ms)
      ✓ should search in both title and description (1126 ms)
    Search Mode Tests
      ✓ should default to semantic search when m parameter is not provided (391 ms)
      ✓ should use semantic search when m=semantic (744 ms)
      ✓ should use MongoDB text search when m=mongo (33 ms)
      ✓ should use semantic search for invalid m parameter values (393 ms)
      ✓ should return correct mode in response for semantic search (1176 ms)
      ✓ should return correct mode in response for mongo search (10 ms)
    Result Limit Tests
      ✓ should default to 10 results when n parameter is not provided (738 ms)
      ✓ should limit results to n items when n is a valid positive number (410 ms)
      ✓ should default to 10 results when n is zero (689 ms)
      ✓ should default to 10 results when n is negative (431 ms)
      ✓ should default to 10 results when n is not a number (408 ms)
      ✓ should handle large n values gracefully (399 ms)
      ✓ should return correct count matching actual results length (2067 ms)
    Edge Cases
      ✓ should handle empty string query (4 ms)
      ✓ should handle very long queries (401 ms)
      ✓ should handle special characters in queries (2178 ms)
      ✓ should handle queries with only numbers (1974 ms)
      ✓ should handle queries with only spaces (3 ms)
      ✓ should handle multiple concurrent requests (1317 ms)
    Combined Parameter Tests
      ✓ should correctly combine m and n parameters for semantic search (468 ms)
      ✓ should correctly combine m and n parameters for mongo search (11 ms)
      ✓ should maintain consistent result format between search modes (409 ms)
      ✓ should include similarity scores in both search modes (1223 ms)
    Performance Tests
      ✎ todo should respond within acceptable time limit for semantic search
      ✎ todo should respond within acceptable time limit for mongo search
      ✎ todo should handle large result sets efficiently
    Error Handling
      ✎ todo should handle database connection errors gracefully
      ✎ todo should handle Qdrant connection errors gracefully
      ✎ todo should handle embedding generation errors gracefully
      ✎ todo should return appropriate error messages for each failure case
      ✎ todo should not expose internal error details in response
    Security Tests
      ✎ todo should sanitize query parameters to prevent injection
      ✎ todo should handle malformed query parameters safely
      ✎ todo should validate and sanitize n parameter
      ✎ todo should validate and sanitize m parameter

-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------|---------|----------|---------|---------|-------------------
All files        |   83.09 |    82.35 |   81.81 |    82.6 |
 src             |   56.25 |        0 |       0 |   56.25 |
  app.js         |   81.81 |      100 |       0 |   81.81 | 16-17
  server.js      |       0 |        0 |       0 |       0 | 1-7
 src/config      |       0 |        0 |       0 |       0 |
  db.js          |       0 |        0 |       0 |       0 |
 src/controllers |   89.36 |    93.33 |     100 |   88.88 |
  search.js      |   89.36 |    93.33 |     100 |   88.88 | 18,23-24,122-123
 src/lib         |     100 |      100 |     100 |     100 |
  prisma.js      |     100 |      100 |     100 |     100 |
 src/routes      |     100 |      100 |     100 |     100 |
  apiRoutes.js   |     100 |      100 |     100 |     100 |
-----------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       12 todo, 26 passed, 38 total
Snapshots:   0 total
Time:        25.103 s
Ran all test suites.
```

- Test Code - ./test/search.test.js

- Search Controller Code - ./src/controllers/search.js

- Qdrant docker-compose - ./docker-compose.yml

- Qdrant setup script - ./scripts/setup-qdrant.js

- Qdrant generate embeddings script - ./scripts/generate-embeddings.js

- Example Search URL (MongoDB) - http://localhost:3337/api/search?q=wooden%20table&n=20&m=mongo

- Example Search URL (Semantic) - http://localhost:3337/api/search?q=wooden%20table&n=20&m=semantic

- Bash commands to setup Qdrant and generate embeddings 

