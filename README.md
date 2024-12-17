# Auction Search System - Developer Documentation

## Project Overview

The Auction Search System is a comprehensive solution for managing and searching auction items using both traditional MongoDB text search and modern semantic search capabilities. The project consists of two main components:

1. **CLI Tool**: A MongoDB seeding utility for managing auction item data
2. **Search API**: A REST API service providing dual-mode search functionality

## Components

### CLI Tool (`/cli-tool`)

A command-line utility for seeding and managing MongoDB with auction item data:

- **Purpose**: Efficiently load and manage auction item data in MongoDB
- **Features**:
  - JSON data validation and parsing
  - Verbose logging mode
  - Docker integration
  - Secure environment variable handling
- **Tech Stack**:
  - Node.js
  - MongoDB
  - Docker
  - Jest for testing

### Search API (`/search-api`)

A modern search API implementing both MongoDB text search and semantic search via Qdrant:

- **Purpose**: Provide flexible search capabilities for auction items
- **Features**:
  - Dual search modes (MongoDB text search and semantic search)
  - Configurable result limits
  - Similarity scoring
  - Concurrent request handling
- **Tech Stack**:
  - Node.js/Express
  - MongoDB
  - Qdrant vector database
  - Google AI text-embedding-004 model
  - Jest for testing

## Documentation Links

- CLI Tool:
  - [Development Notes](./cli-tool/DEV_NOTES.md)
  - [Testing Log](./cli-tool/TESTING_LOG.md)
- Search API:
  - [Testing Log](./search-api/TESTING_LOG.md)

## Environment Variables

### CLI Tool
```env
MONGO_USERNAME=admin
MONGO_PASSWORD=password
MONGO_DATABASE=auction
MONGO_PORT=27017
MONGO_URI=mongodb://localhost:27017
DB_NAME=auction
COLLECTION_NAME=auctionItems
```

### Search API
```env
MONGO_USERNAME=admin
MONGO_PASSWORD=password
MONGO_DATABASE=auction
MONGO_PORT=27017
MONGO_URI=mongodb://localhost:27017
DB_NAME=auction
COLLECTION_NAME=auctionItems
PORT=3337
DATABASE_URL="mongodb://admin:password@localhost:27017/auction?authSource=admin"
GEMINI_API_KEY=google_api_key
```

### Project Structure

```text
auction-search/
├── cli-tool/                    # MongoDB seeding utility
│   ├── src/                     # CLI tool source code
│   │   ├── seed.js             # Main seeding script
│   │   └── utils/              # Utility functions
│   ├── test/                   # Test files
│   ├── datasets/               # Sample JSON data
│   ├── docker-compose.yml      # MongoDB container config
│   └── package.json            # Dependencies
│
├── search-api/                  # Search API service
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/            # API routes
│   │   └── lib/               # Shared utilities
│   ├── scripts/               # Setup scripts
│   │   ├── setup-qdrant.js    # Qdrant initialization
│   │   └── generate-embeddings.js # Vector generation
│   ├── test/                  # Test files
│   ├── docker-compose.yml     # Qdrant container config
│   └── package.json           # Dependencies
│
└── docs/                       # Project documentation
    ├── DEV_NOTES.md           # This file
    └── README.md              # Project overview
```

### Development Status

- [x] MongoDB CLI Seeding Tool
  - [x] Basic functionality
  - [x] Unit tests
  - [x] Integration tests
  - [x] Docker support
  - [x] Documentation
- [x] Search API
  - [x] MongoDB text search
  - [x] Semantic search with Qdrant
  - [x] API endpoints
  - [x] Test suite
  - [x] Docker support
  - [x] Documentation

### Project Setup

```
# Clone the repository
git clone https://github.com/your-username/auction-search.git

# Navigate to the project directory
cd auction-search

# Navigiate to the CLI Tool directory
cd cli-tool

# Update a .env file with your MongoDB connection details
nano .env

# Install dependencies
npm install
```

### Running the CLI Tool

```
# Run the MongoDB seeding tool
# Spin up MongoDB, create database and collection, and seed data
docker compose up -d # Spin up MongoDB
node src/seed.js -f datasets/auction-items.json --verbose # Seed MongoDB

# run tests
npm test # Run tests
```

### Running the Search API

```
cd ..
cd search-api

# Update a .env file with your MongoDB and Qdrant connection details
nano .env

# Install dependencies
npm install

# Spin up Qdrant, setup Qdrant collection, generate embeddings
docker compose up -d # Spin up Qdrant
npm run create-indexes # Create text indexes in MongoDB
npm run setup-qdrant # Setup Qdrant collection
npm run generate-embeddings # Generate aution item embeddings in Qdrant using Google Generative AI text-embedding-004 model

# Run tests and start server
npm test # Run tests
npm start # Start the server
```

### API Documentation

- MongoDB Text Search:

  - API endpoint for MongoDB text search:

```text
GET http://localhost:3337/api/search?q=wooden%20table&n=20&m=mongo
```

- cURL Example:

```bash
curl -X GET -G \
  "http://localhost:3337/api/search" \
  -d "q=wooden+table" \
  -d "n=20" \
  -d "m=mongo" | jq '.'
```


- API Response:

```json
{
    "items": [
        {
            "_id": {
                "$oid": "6761bd59c054e39e35658248"
            },
            "title": "Vintage Wooden Table",
            "description": "A beautifully crafted wooden table, perfect for your dining room.",
            "start_price": 50,
            "reserve_price": 100,
            "score": 2.4761904761904763
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582cc"
            },
            "title": "Acacia Nesting Tables",
            "description": "Set of three stylish nesting tables crafted from acacia hardwood.",
            "start_price": 180,
            "reserve_price": 400,
            "score": 1.2291666666666665
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582e2"
            },
            "title": "Walnut Veneer Coffee Table",
            "description": "Sophisticated coffee table with a rich walnut veneer finish.",
            "start_price": 180,
            "reserve_price": 400,
            "score": 1.1964285714285714
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582df"
            },
            "title": "Polished Teak Side Table",
            "description": "Compact teakwood side table with a sleek polished surface.",
            "start_price": 200,
            "reserve_price": 400,
            "score": 1.1964285714285714
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582c3"
            },
            "title": "Plywood Nordic Dining Table",
            "description": "Minimalist dining table with a smooth plywood surface and contemporary design.",
            "start_price": 220,
            "reserve_price": 450,
            "score": 1.1875
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582ca"
            },
            "title": "Polished Burlwood Accent Table",
            "description": "Unique table crafted from burlwood with natural knots and polished finish.",
            "start_price": 250,
            "reserve_price": 500,
            "score": 1.1875
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582d1"
            },
            "title": "Industrial Pallet Coffee Table",
            "description": "Repurposed pallet table with a raw, industrial look and caster wheels.",
            "start_price": 120,
            "reserve_price": 300,
            "score": 1.1875
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582ce"
            },
            "title": "Reclaimed Barn Door Table",
            "description": "Rustic dining table created from a reclaimed barn door with a natural finish.",
            "start_price": 450,
            "reserve_price": 900,
            "score": 1.1805555555555556
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582bf"
            },
            "title": "Handcrafted Rimu Coffee Table",
            "description": "A stunning low-profile coffee table made from recovered rimu timber.",
            "start_price": 180,
            "reserve_price": 350,
            "score": 1.1805555555555556
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582c7"
            },
            "title": "Driftwood-Inspired Coffee Table",
            "description": "Artistic coffee table designed to resemble natural driftwood for a beachy aesthetic.",
            "start_price": 150,
            "reserve_price": 350,
            "score": 1.1805555555555556
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582bd"
            },
            "title": "Rustic Pine Farmhouse Table",
            "description": "A charming farmhouse dining table crafted from solid pine with natural grain details.",
            "start_price": 150,
            "reserve_price": 300,
            "score": 1.175
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e3565827e"
            },
            "title": "Hand-Crafted Wooden Balance Transporter",
            "description": "A minimalist wooden two-wheeler for toddlers learning to balance.",
            "start_price": 40,
            "reserve_price": 100,
            "score": 1.1714285714285713
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582c6"
            },
            "title": "Walnut Mid-Century Console Table",
            "description": "A sleek, walnut-finished console table with clean lines and retro charm.",
            "start_price": 300,
            "reserve_price": 600,
            "score": 1.1555555555555554
        },
        {
            "_id": {
                "$oid": "6761bd59c054e39e356582c0"
            },
            "title": "Solid Oak Dining Set",
            "description": "Includes a dining table and six matching chairs built from solid oak for durability and style.",
            "start_price": 500,
            "reserve_price": 900,
            "score": 0.5454545454545454
        }
    ],
    "count": 14,
    "query": "wooden table",
    "mode": "mongo"
}
```

- Semantic Search:

  - API endpoint for semantic search:

```text
GET http://localhost:3337/api/search?q=wooden%20table&n=20&m=semantic
```

```bash
curl -X GET -G \
  "http://localhost:3337/api/search" \
  -d "q=wooden+table" \
  -d "n=20" \
  -d "m=semantic" | jq '.'
```

- API Response:

```json
{
    "items": [
        {
            "_id": "6761bd59c054e39e35658248",
            "title": "Vintage Wooden Table",
            "description": "A beautifully crafted wooden table, perfect for your dining room.",
            "start_price": 50,
            "reserve_price": 100,
            "score": 0.80172104
        },
        {
            "_id": "6761bd59c054e39e356582c3",
            "title": "Plywood Nordic Dining Table",
            "description": "Minimalist dining table with a smooth plywood surface and contemporary design.",
            "start_price": 220,
            "reserve_price": 450,
            "score": 0.65036666
        },
        {
            "_id": "6761bd59c054e39e356582bd",
            "title": "Rustic Pine Farmhouse Table",
            "description": "A charming farmhouse dining table crafted from solid pine with natural grain details.",
            "start_price": 150,
            "reserve_price": 300,
            "score": 0.639088
        },
        {
            "_id": "6761bd59c054e39e356582ce",
            "title": "Reclaimed Barn Door Table",
            "description": "Rustic dining table created from a reclaimed barn door with a natural finish.",
            "start_price": 450,
            "reserve_price": 900,
            "score": 0.6351471
        },
        {
            "_id": "6761bd59c054e39e356582ca",
            "title": "Polished Burlwood Accent Table",
            "description": "Unique table crafted from burlwood with natural knots and polished finish.",
            "start_price": 250,
            "reserve_price": 500,
            "score": 0.62416315
        },
        {
            "_id": "6761bd59c054e39e356582cc",
            "title": "Acacia Nesting Tables",
            "description": "Set of three stylish nesting tables crafted from acacia hardwood.",
            "start_price": 180,
            "reserve_price": 400,
            "score": 0.59080744
        },
        {
            "_id": "6761bd59c054e39e356582c0",
            "title": "Solid Oak Dining Set",
            "description": "Includes a dining table and six matching chairs built from solid oak for durability and style.",
            "start_price": 500,
            "reserve_price": 900,
            "score": 0.5873027
        },
        {
            "_id": "6761bd59c054e39e356582da",
            "title": "Plywood Office Desk",
            "description": "Modern, lightweight desk with a polished plywood surface and minimalist design.",
            "start_price": 180,
            "reserve_price": 350,
            "score": 0.5825113
        },
        {
            "_id": "6761bd59c054e39e356582e2",
            "title": "Walnut Veneer Coffee Table",
            "description": "Sophisticated coffee table with a rich walnut veneer finish.",
            "start_price": 180,
            "reserve_price": 400,
            "score": 0.5811514
        },
        {
            "_id": "6761bd59c054e39e356582c6",
            "title": "Walnut Mid-Century Console Table",
            "description": "A sleek, walnut-finished console table with clean lines and retro charm.",
            "start_price": 300,
            "reserve_price": 600,
            "score": 0.58035314
        },
        {
            "_id": "6761bd59c054e39e356582c7",
            "title": "Driftwood-Inspired Coffee Table",
            "description": "Artistic coffee table designed to resemble natural driftwood for a beachy aesthetic.",
            "start_price": 150,
            "reserve_price": 350,
            "score": 0.57912564
        },
        {
            "_id": "6761bd59c054e39e356582df",
            "title": "Polished Teak Side Table",
            "description": "Compact teakwood side table with a sleek polished surface.",
            "start_price": 200,
            "reserve_price": 400,
            "score": 0.5756091
        },
        {
            "_id": "6761bd59c054e39e356582cb",
            "title": "Solid Timber Workbench",
            "description": "Heavy-duty workbench perfect for woodworking or garage projects.",
            "start_price": 300,
            "reserve_price": 600,
            "score": 0.5736216
        },
        {
            "_id": "6761bd59c054e39e356582c8",
            "title": "Hardwood Patio Bench",
            "description": "Durable outdoor bench built from weather-resistant hardwood materials.",
            "start_price": 200,
            "reserve_price": 400,
            "score": 0.555102
        },
        {
            "_id": "6761bd59c054e39e356582d1",
            "title": "Industrial Pallet Coffee Table",
            "description": "Repurposed pallet table with a raw, industrial look and caster wheels.",
            "start_price": 120,
            "reserve_price": 300,
            "score": 0.55241585
        },
        {
            "_id": "6761bd59c054e39e3565827e",
            "title": "Hand-Crafted Wooden Balance Transporter",
            "description": "A minimalist wooden two-wheeler for toddlers learning to balance.",
            "start_price": 40,
            "reserve_price": 100,
            "score": 0.53825504
        },
        {
            "_id": "6761bd59c054e39e356582c2",
            "title": "Recovered Timber Hall Stand",
            "description": "Sustainable hall stand crafted from reclaimed timber with rustic appeal.",
            "start_price": 150,
            "reserve_price": 300,
            "score": 0.534033
        },
        {
            "_id": "6761bd59c054e39e356582be",
            "title": "Antique Kauri Writing Desk",
            "description": "Elegant kauri timber desk with intricate carvings and vintage hardware.",
            "start_price": 200,
            "reserve_price": 400,
            "score": 0.5260058
        },
        {
            "_id": "6761bd59c054e39e356582d3",
            "title": "Scandinavian Birch Nightstand",
            "description": "Minimalist birch nightstand with clean lines and natural hues.",
            "start_price": 100,
            "reserve_price": 250,
            "score": 0.52013165
        },
        {
            "_id": "6761bd59c054e39e356582bf",
            "title": "Handcrafted Rimu Coffee Table",
            "description": "A stunning low-profile coffee table made from recovered rimu timber.",
            "start_price": 180,
            "reserve_price": 350,
            "score": 0.5197228
        }
    ],
    "count": 20,
    "query": "wooden table",
    "mode": "semantic"
}
```

###Testing Coverage

The project maintains high test coverage with comprehensive test suites for both components:

- CLI Tool: Unit and integration tests
- Search API: Feature, integration, and edge case tests

For detailed test results and coverage reports, see the respective TESTING_LOG.md files in each component's directory.