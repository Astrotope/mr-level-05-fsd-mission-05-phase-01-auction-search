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

- MongoDB Text Search (only finds textual matches with steming, trike, trikes, etc...):

  - API endpoint for MongoDB text search:

```text
GET http://localhost:3337/api/search?q=trike&n=20&m=mongo
```

- cURL Example:

```bash
curl -X GET -G \
  "http://localhost:3337/api/search" \
  -d "q=trike" \
  -d "n=20" \
  -d "m=mongo" | jq '.'
```


- API Response:

```json
{
    "items": [
        {
            "_id": "6761bd59c054e39e356582ba",
            "title": "Children's Trike",
            "description": "Fun and safe tricycle for toddlers, with a sturdy frame and basket.",
            "start_price": 60,
            "reserve_price": 120,
            "score": 0.75
        },
        {
            "_id": "6761bd59c054e39e3565827a",
            "title": "Kid's Training Trike",
            "description": "A colorful and stable three-wheeled ride for young learners.",
            "start_price": 50,
            "reserve_price": 120,
            "score": 0.6666666666666666
        },
        {
            "_id": "6761bd59c054e39e3565827f",
            "title": "Electric-Powered Trike for Seniors",
            "description": "Comfortable electric three-wheeler with pedal assist for easy mobility.",
            "start_price": 700,
            "reserve_price": 1400,
            "score": 0.625
        }
    ],
    "count": 3,
    "query": "trike",
    "mode": "mongo"
}
```

- Semantic Search:

  - API endpoint for semantic search (finds semantic matches, trike, tricycle, three-wheeler):

```text
GET http://localhost:3337/api/search?q=trike&n=20&m=semantic
```

```bash
curl -X GET -G \
  "http://localhost:3337/api/search" \
  -d "q=trike" \
  -d "n=20" \
  -d "m=semantic" | jq '.'
```

- API Response:

```json
{
    "items": [
        {
            "_id": "6761bd59c054e39e3565827a",
            "title": "Kid's Training Trike",
            "description": "A colorful and stable three-wheeled ride for young learners.",
            "start_price": 50,
            "reserve_price": 120,
            "score": 0.7148431
        },
        {
            "_id": "6761bd59c054e39e3565827f",
            "title": "Electric-Powered Trike for Seniors",
            "description": "Comfortable electric three-wheeler with pedal assist for easy mobility.",
            "start_price": 700,
            "reserve_price": 1400,
            "score": 0.68524075
        },
        {
            "_id": "6761bd59c054e39e356582ba",
            "title": "Children's Trike",
            "description": "Fun and safe tricycle for toddlers, with a sturdy frame and basket.",
            "start_price": 60,
            "reserve_price": 120,
            "score": 0.68407923
        },
        {
            "_id": "6761bd59c054e39e3565829f",
            "title": "Adult Tricycle",
            "description": "Stable and easy-to-ride three-wheeled bike with a cargo basket.",
            "start_price": 300,
            "reserve_price": 600,
            "score": 0.66994584
        },
        {
            "_id": "6761bd59c054e39e35658291",
            "title": "Rugged Tricycle Hauler",
            "description": "Heavy-duty three-wheeler built for carrying cargo on stable wheels.",
            "start_price": 550,
            "reserve_price": 1100,
            "score": 0.6541539
        },
        {
            "_id": "6761bd59c054e39e35658271",
            "title": "Three-Wheel Adult Cruiser",
            "description": "Comfortable three-wheeler designed for stable and smooth rides.",
            "start_price": 350,
            "reserve_price": 700,
            "score": 0.64103293
        },
        {
            "_id": "6761bd59c054e39e35658276",
            "title": "Retro Three-Wheel Cruiser",
            "description": "Stylish three-wheeler with a vintage aesthetic for leisurely commutes.",
            "start_price": 400,
            "reserve_price": 800,
            "score": 0.6405463
        },
        {
            "_id": "6761bd59c054e39e35658283",
            "title": "Three-Wheel Cargo Carrier",
            "description": "A sturdy three-wheeler with extra space for hauling groceries or goods.",
            "start_price": 500,
            "reserve_price": 1000,
            "score": 0.61973
        },
        {
            "_id": "6761bd59c054e39e35658287",
            "title": "Cargo-Ready Three-Wheeler",
            "description": "A practical and durable transporter with a large rear compartment.",
            "start_price": 400,
            "reserve_price": 800,
            "score": 0.5701764
        },
        {
            "_id": "6761bd59c054e39e3565828b",
            "title": "Luxury Tandem Cruiser",
            "description": "A sleek two-seater designed for couples looking for smooth rides.",
            "start_price": 700,
            "reserve_price": 1400,
            "score": 0.5161332
        },
        {
            "_id": "6761bd59c054e39e35658285",
            "title": "Chopper-Style Two-Wheeler",
            "description": "An elongated ride with a chopper-inspired frame for a unique cruising experience.",
            "start_price": 300,
            "reserve_price": 700,
            "score": 0.5102613
        },
        {
            "_id": "6761bd59c054e39e3565829d",
            "title": "Unicycle",
            "description": "High-quality unicycle, perfect for beginners and performers.",
            "start_price": 70,
            "reserve_price": 150,
            "score": 0.4698544
        },
        {
            "_id": "6761bd59c054e39e356582bb",
            "title": "Bike Trailer for Kids",
            "description": "Two-seat bike trailer for safely towing kids on bike rides.",
            "start_price": 150,
            "reserve_price": 300,
            "score": 0.4591624
        },
        {
            "_id": "6761bd59c054e39e35658286",
            "title": "High-Performance Unicycle",
            "description": "Sturdy single-wheeler built for skill development and advanced riders.",
            "start_price": 120,
            "reserve_price": 250,
            "score": 0.45850718
        },
        {
            "_id": "6761bd59c054e39e35658299",
            "title": "Kids' Balance Bike",
            "description": "Beginner-friendly pushbike to help toddlers learn balance and coordination.",
            "start_price": 50,
            "reserve_price": 100,
            "score": 0.45088845
        },
        {
            "_id": "6761bd59c054e39e35658290",
            "title": "Electric Cargo Hauler",
            "description": "Battery-powered two-wheeler with a sturdy rear compartment for deliveries.",
            "start_price": 900,
            "reserve_price": 1800,
            "score": 0.44730467
        },
        {
            "_id": "6761bd59c054e39e3565828f",
            "title": "Recumbent Touring Rig",
            "description": "Long-distance touring machine designed for ultimate comfort.",
            "start_price": 800,
            "reserve_price": 1600,
            "score": 0.44403493
        },
        {
            "_id": "6761bd59c054e39e356582a3",
            "title": "Bike Cargo Trailer",
            "description": "Sturdy cargo trailer for transporting goods with your bicycle.",
            "start_price": 120,
            "reserve_price": 250,
            "score": 0.44290248
        },
        {
            "_id": "6761bd59c054e39e35658281",
            "title": "Dirt-Ready Trail Crusher",
            "description": "Tough trail ride with reinforced suspension for dirt paths.",
            "start_price": 450,
            "reserve_price": 900,
            "score": 0.44034582
        },
        {
            "_id": "6761bd59c054e39e3565827d",
            "title": "Fat Tire Off-Roader",
            "description": "Built to conquer rough terrains with oversized wheels for stability.",
            "start_price": 600,
            "reserve_price": 1200,
            "score": 0.4401132
        }
    ],
    "count": 20,
    "query": "trike",
    "mode": "semantic"
}```

###Testing Coverage

The project maintains high test coverage with comprehensive test suites for both components:

- CLI Tool: Unit and integration tests
- Search API: Feature, integration, and edge case tests

For detailed test results and coverage reports, see the respective TESTING_LOG.md files in each component's directory.