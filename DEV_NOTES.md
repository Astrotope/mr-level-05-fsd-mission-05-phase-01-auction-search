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

```text
GET http://localhost:3337/api/search?q=wooden%20table&n=20&m=mongo
```

- Semantic Search:

```text
GET http://localhost:3337/api/search?q=wooden%20table&n=20&m=semantic
```

###Testing Coverage
The project maintains high test coverage with comprehensive test suites for both components:

- CLI Tool: Unit and integration tests
- Search API: Feature, integration, and edge case tests

For detailed test results and coverage reports, see the respective TESTING_LOG.md files in each component's directory.