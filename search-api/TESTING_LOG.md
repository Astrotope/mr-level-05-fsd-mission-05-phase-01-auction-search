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

- Test Code - ./test/search.test.js

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
  test.todo('should search in title only');
  test.todo('should search in description only');
  test.todo('should search in title and description');
  test.todo('should return 404 if no items found');
  test.todo('should return 500 if server error');

});
```