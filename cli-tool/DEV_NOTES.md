# Development Notes

---

### [If you do not have a running installation of MongoDB]
### You can start a local MongoDB instance by using the following commands:

1. Start MongoDB container:
```bash
docker compose up -d
```

2. Stop MongoDB container:
```bash
docker-compose down
```

3. Restart MongoDB container:
```bash
docker-compose restart
```

### Environment Variables are set in the .env file
### You may need to change these to match your MongoDB installation (if not using Docker)

#### Required Variables
```bash
MONGO_USERNAME=admin                    # MongoDB username
MONGO_PASSWORD=password                 # MongoDB password
MONGO_DATABASE=auction                  # MongoDB database name
MONGO_PORT=27017                        # MongoDB port
MONGO_URI=mongodb://localhost:27017     # MongoDB connection URI
DB_NAME=auction                         # Database name for the application
COLLECTION_NAME=auctionItems            # Collection name for auction items
```

### CLI Tool Usage

#### Basic Command
```bash
node src/seed.js -f datasets/auction-items.json --verbose
```

#### CLI Options
- `-f, --file <path>`: Path to the JSON file containing auction items (default: "auction_items.json")
- `--verbose`: Display environment variables and additional information
- `-v, --version`: Display version information
- `-h, --help`: Display help information

### Testing

#### Running Tests

##### Unit Tests
```bash
npm test
```

##### Integration Tests Only
```bash
npm run test:integration
```

##### All Tests (Unit + Integration)
```bash
npm run test:all
```

#### Integration Test Requirements
1. Docker must be installed and running
2. MongoDB image must be pulled:
```bash
docker pull mongo:latest
```

### Project Structure
```
auction-search/cli-tool/
├── src/                            # Source code directory
│   ├── src/                        # Main source files
│   │   └── seed.js                 # Main CLI tool implementation
│   ├── test/                       # Test files
│   │   ├── seed.test.js            # Unit tests
│   │   └── seed.integration.test.js# Integration tests
│   ├── datasets/                   # Sample data
│   │   └── auction-items.json      # Sample auction items
│   ├── coverage/                   # Test coverage reports
│   ├── .env                        # Environment variables
│   ├── package.json                # Project dependencies and scripts
│   └── jest.config.js              # Jest test configuration
├── docker-compose.yml              # Docker compose for local development
└── mongo-init.js                   # MongoDB initialization script
```

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:integration": "RUN_INTEGRATION_TESTS=1 jest test/seed.integration.test.js",
    "test:all": "RUN_INTEGRATION_TESTS=1 jest",
    "test:watch": "jest --watch",
    "lint": "eslint src tests"
  }
}
```

### Environment Variables

#### Required Variables
```bash
MONGO_USERNAME=admin           # MongoDB username
MONGO_PASSWORD=password        # MongoDB password
MONGO_DATABASE=auction         # MongoDB database name
MONGO_PORT=27017              # MongoDB port
MONGO_URI=mongodb://localhost:27017  # MongoDB connection URI
DB_NAME=auction               # Database name for the application
COLLECTION_NAME=auctionItems  # Collection name for auction items
```

#### Notes on Environment Variables
- All variables are required for the application to run
- `MONGO_PASSWORD` is masked in verbose output for security
- URI is constructed with credentials during runtime
- Integration tests use a separate container and don't require these variables

### Integration Test Documentation

The integration tests (seed.integration.test.js) cover:

1. **Database Connection**
   - Successfully connecting to MongoDB container
   - Container startup and shutdown

2. **Data Seeding**
   - Inserting test data into MongoDB
   - Verifying data persistence

3. **Data Cleanup**
   - Clearing existing data before new seeds
   - Verifying only new data exists after reseeding


### Unit Tests Documentation

#### Environment Variables Loader Tests

Tests the `loadEnv()` function which manages environment variable loading and validation:

1. **Basic Environment Loading**
   - Loads variables from .env file
   - Verifies all required variables are present
   - Checks correct values are loaded

2. **Missing Variables Handling**
   - Tests missing MONGO_URI
   - Tests missing DB_NAME
   - Tests missing COLLECTION_NAME
   - Tests missing MONGO_USERNAME
   - Tests missing MONGO_PASSWORD
   - Tests multiple missing variables

3. **Error Messages**
   - Verifies correct error messages for missing variables
   - Ensures proper formatting of multiple missing variables

#### Command Line Options Tests

Tests the `parseArgs()` function which handles CLI argument parsing:

1. **Default Values**
   - Verifies default file path ("auction_items.json")
   - Checks default verbose setting

2. **Command Options**
   - Tests -f/--file option for file path
   - Tests --verbose flag
   - Tests -v/--version flag
   - Tests -h/--help flag

3. **Version Information**
   - Verifies version output format
   - Checks copyright information
   - Validates help text content

4. **Environment Display**
   - Tests verbose mode environment variable display
   - Verifies password masking in output
   - Checks formatting of environment information

#### JSON File Reader Tests

Tests the `readFile()` function for JSON file handling:

1. **Valid JSON**
   - Reads and parses valid JSON files
   - Handles different data structures
   - Verifies data integrity

2. **Error Handling**
   - Tests invalid JSON format
   - Handles non-existent files
   - Proper error messages for different scenarios

#### MongoDB Seeder Tests (Mocked)

Tests the `seedMongoDB()` function using mocked MongoDB client:

1. **Connection Handling**
   - Tests successful database connection
   - Verifies connection error handling
   - Checks proper cleanup on errors

2. **Data Operations**
   - Tests collection clearing (deleteMany)
   - Verifies data insertion (insertMany)
   - Checks return values for operations

3. **Error Scenarios**
   - Tests connection failures
   - Handles insertion errors
   - Verifies cleanup on failures
