# Testing Log - CLI Database Seeder

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
    "test": "jest",
    "test:integration": "RUN_INTEGRATION_TESTS=1 jest test/seed.integration.test.js",
    "test:all": "RUN_INTEGRATION_TESTS=1 jest",
    "test:watch": "jest --watch",
    "lint": "eslint src tests"
  },
  "devDependencies": {
    "dotenv": "^16.4.7",
    "jest": "^29.7.0",
    "testcontainers": "^10.16.0"
  }
```

- Test Code - seed.test.js

```javascript
describe("Environment Variables Loader - Tests", () => {

  test.todo("should load environment variables from .env file");
  test.todo("should throw an error if required variables are missing");
  test.todo("should let user know which variable/s is /are missing");

});

describe("CLI Argument Parser - Tests", () => {

  test.todo("should use default file path if none is provided");
  test.todo("should display version when --version option used");
  test.todo("should display help when --help option used");
  test.todo("should accept short and long version of file path option -f & --file-path");
  test.todo("should display environment variables and number of items seeded if --verbose or -v option used");

});

describe("JSON File Reader - Tests", () => {

  test.todo("should read and parse a valid JSON file");
  test.todo("should throw an error for invalid JSON");
  test.todo("should throw an error if file is missing");

});

describe("MongoDB Seeder - Tests", () => {

  test.todo("should establish connection database");
  test.todo("should throw an error if cannot connect to database");
  test.todo("should load seed data into database/connection");
  test.todo("sholud throw an error if cannot load seed data into database");

});
```

- CLI Tool Code - seed.js

```javascript
None
```

- Test Run

```bash
npm test

> src@1.0.0 test
> jest

 PASS  test/seed.test.js
  Environment Variables Loader - Tests
    ✎ todo should load environment variables from .env file
    ✎ todo should throw an error if required variables are missing
    ✎ todo should let user know which variable/s is /are missing
  CLI Argument Parser - Tests
    ✎ todo should use default file path if none is provided
    ✎ todo should display version when --version option used
    ✎ todo should display help when --help option used
    ✎ todo should accept short and long version of file path option -f & --file-path
    ✎ todo should display environment variables and number of items seeded if --verbose or -v option used
  JSON File Reader - Tests
    ✎ todo should read and parse a valid JSON file
    ✎ todo should throw an error for invalid JSON
    ✎ todo should throw an error if file is missing
  MongoDB Seeder - Tests
    ✎ todo should establish connection database
    ✎ todo should throw an error if cannot connect to database
    ✎ todo should load seed data into database/connection
    ✎ todo sholud throw an error if cannot load seed data into database

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |
 seed.js  |       0 |        0 |       0 |       0 |
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       15 todo, 15 total
Snapshots:   0 total
Time:        1.06 s
Ran all test suites.
```

---

### Step 02 - Create First Test & Failing Code for First Method

- Test Code - seed.test.js

```javascript
const dotenv = require("dotenv");

describe("Environment Variables Loader - Tests", () => {

  beforeEach(() => {
    jest.resetModules();
    delete process.env.MONGO_URI;
    delete process.env.DB_NAME;
    delete process.env.COLLECTION_NAME;
  });

  test("should load environment variables from .env file", () => {

    dotenv.config = jest.fn(() => {
      // Simulate dotenv.config by assigning values to process.env
      process.env.MONGO_URI = "mongodb://test_uri";
      process.env.DB_NAME = "test_db";
      process.env.COLLECTION_NAME = "test_collection";
    });

    const { loadEnv } = require("../src/seed");
    dotenv.config();
    const { MONGO_URI, DB_NAME, COLLECTION_NAME } = loadEnv();

    expect(MONGO_URI).toBe("mongodb://test_uri");
    expect(DB_NAME).toBe("test_db");
    expect(COLLECTION_NAME).toBe("test_collection");

  });

  test.todo("should throw an error if required variables are missing");
  test.todo("should let user know which variable/s is /are missing");

});

...

[Other tests]
```

- CLI Tool Code - seed.js

```javascript
const dotenv = require("dotenv");

dotenv.config();

function loadEnv() {
  const { MONGO_URI, DB_NAME, COLLECTION_NAME } = [null, null, null];
  return { MONGO_URI, DB_NAME, COLLECTION_NAME };
};

loadEnv();

module.exports = { loadEnv };
```

- Test Run

```bash
npm test

> src@1.0.0 test
> jest

 FAIL  test/seed.test.js
  Environment Variables Loader - Tests
    ✕ should load environment variables from .env file (199 ms)
    ✎ todo should throw an error if required variables are missing
    ✎ todo should let user know which variable/s is /are missing
  CLI Argument Parser - Tests
    ✎ todo should use default file path if none is provided
    ✎ todo should display version when --version option used
    ✎ todo should display help when --help option used
    ✎ todo should accept short and long version of file path option -f & --file-path
    ✎ todo should display environment variables and number of items seeded if --verbose or -v option used
  JSON File Reader - Tests
    ✎ todo should read and parse a valid JSON file
    ✎ todo should throw an error for invalid JSON
    ✎ todo should throw an error if file is missing
  MongoDB Seeder - Tests
    ✎ todo should establish connection database
    ✎ todo should throw an error if cannot connect to database
    ✎ todo should load seed data into database/connection
    ✎ todo sholud throw an error if cannot load seed data into database

  ● Environment Variables Loader - Tests › should load environment variables from .env file

    expect(received).toBe(expected) // Object.is equality

    Expected: "mongodb://test_uri"
    Received: undefined

      23 |     const { MONGO_URI, DB_NAME, COLLECTION_NAME } = loadEnv();
      24 |
    > 25 |     expect(MONGO_URI).toBe("mongodb://test_uri");
         |                       ^
      26 |     expect(DB_NAME).toBe("test_db");
      27 |     expect(COLLECTION_NAME).toBe("test_collection");
      28 |

      at Object.toBe (test/seed.test.js:25:23)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |
 seed.js  |     100 |      100 |     100 |     100 |
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 failed, 1 total
Tests:       1 failed, 14 todo, 15 total
Snapshots:   0 total
Time:        1.103 s
Ran all test suites.
```

---


### Step 03 - Create Passing Code - First Method

- Test Code - seed.test.js

```javascript
const dotenv = require("dotenv");

describe("Environment Variables Loader - Tests", () => {

  beforeEach(() => {
    jest.resetModules();
    delete process.env.MONGO_URI;
    delete process.env.DB_NAME;
    delete process.env.COLLECTION_NAME;
  });

  test("should load environment variables from .env file", () => {

    dotenv.config = jest.fn(() => {
      // Simulate dotenv.config by assigning values to process.env
      process.env.MONGO_URI = "mongodb://test_uri";
      process.env.DB_NAME = "test_db";
      process.env.COLLECTION_NAME = "test_collection";
    });

    const { loadEnv } = require("../src/seed");
    dotenv.config();
    const { MONGO_URI, DB_NAME, COLLECTION_NAME } = loadEnv();

    expect(MONGO_URI).toBe("mongodb://test_uri");
    expect(DB_NAME).toBe("test_db");
    expect(COLLECTION_NAME).toBe("test_collection");

  });

  test.todo("should throw an error if required variables are missing");
  test.todo("should let user know which variable/s is /are missing");

});

...

[Other tests]
```

- CLI Tool Code - seed.js

```javascript
const dotenv = require("dotenv");

dotenv.config();

function loadEnv() {
  const { MONGO_URI, DB_NAME, COLLECTION_NAME } = process.env;
  console.log(`MONGO_URI: ${MONGO_URI}, DB_NAME: ${DB_NAME}, COLLECTION_NAME: ${COLLECTION_NAME}`)
  return { MONGO_URI, DB_NAME, COLLECTION_NAME };
  if (!MONGO_URI || !DB_NAME || !COLLECTION_NAME) {
    throw new Error("Missing required environment variables");
  }
};

loadEnv();

module.exports = { loadEnv };
```

- Test Run

```bash
npm test

> src@1.0.0 test
> jest

  console.log
    MONGO_URI: TEST_URI, DB_NAME: TEST_DB_NAME, COLLECTION_NAME: TEST_COLLECTION_NAME

      at log (src/seed.js:7:11)

  console.log
    MONGO_URI: mongodb://test_uri, DB_NAME: test_db, COLLECTION_NAME: test_collection

      at log (src/seed.js:7:11)

 PASS  test/seed.test.js
  Environment Variables Loader - Tests
    ✓ should load environment variables from .env file (24 ms)
    ✎ todo should throw an error if required variables are missing
    ✎ todo should let user know which variable/s is /are missing
  CLI Argument Parser - Tests
    ✎ todo should use default file path if none is provided
    ✎ todo should display version when --version option used
    ✎ todo should display help when --help option used
    ✎ todo should accept short and long version of file path option -f & --file-path
    ✎ todo should display environment variables and number of items seeded if --verbose or -v option used
  JSON File Reader - Tests
    ✎ todo should read and parse a valid JSON file
    ✎ todo should throw an error for invalid JSON
    ✎ todo should throw an error if file is missing
  MongoDB Seeder - Tests
    ✎ todo should establish connection database
    ✎ todo should throw an error if cannot connect to database
    ✎ todo should load seed data into database/connection
    ✎ todo sholud throw an error if cannot load seed data into database

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   77.77 |        0 |     100 |   77.77 |
 seed.js  |   77.77 |        0 |     100 |   77.77 | 9-10
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       14 todo, 1 passed, 15 total
Snapshots:   0 total
Time:        0.915 s
Ran all test suites.
```

---

### Step 04 - Create Passing Code - All Methods

- Test Code - seed.test.js

```javascript
const dotenv = require("dotenv");
const { MongoClient } = require('mongodb');
const { loadEnv, parseArgs, displayEnvironmentVariables, getVersionInfo, readFile } = require("../src/seed");
const { Command } = require('commander');

jest.mock('mongodb', () => {
  const mockCollection = {
    deleteMany: jest.fn().mockResolvedValue({}),
    insertMany: jest.fn().mockResolvedValue({ insertedCount: 2 })
  };

  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection)
  };

  const mockClient = {
    connect: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue(mockDb),
    close: jest.fn().mockResolvedValue(undefined)
  };

  return {
    MongoClient: jest.fn().mockImplementation(() => mockClient)
  };
});

const { seedMongoDB } = require("../src/seed");

describe("Environment Variables Loader - Tests", () => {

  beforeEach(() => {
    jest.resetModules();
    delete process.env.MONGO_URI;
    delete process.env.DB_NAME;
    delete process.env.COLLECTION_NAME;
    delete process.env.MONGO_USERNAME;
    delete process.env.MONGO_PASSWORD;
  });

  afterEach(() => {
    jest.resetModules();
    process.env.MONGO_URI = "mongodb://test_uri";
    process.env.DB_NAME = "test_db";
    process.env.COLLECTION_NAME = "test_collection";
    process.env.MONGO_USERNAME = "test_user";
    process.env.MONGO_PASSWORD = "test_password";
  });

  test("should load environment variables from .env file", () => {

    dotenv.config = jest.fn(() => {
      // Simulate dotenv.config by assigning values to process.env
      process.env.MONGO_URI = "mongodb://test_uri";
      process.env.DB_NAME = "test_db";
      process.env.COLLECTION_NAME = "test_collection";
      process.env.MONGO_USERNAME = "test_user";
      process.env.MONGO_PASSWORD = "test_password";
    });

    dotenv.config();
    const { MONGO_URI, DB_NAME, COLLECTION_NAME, MONGO_USERNAME, MONGO_PASSWORD } = loadEnv();
    expect(MONGO_URI).toBe("mongodb://test_uri");
    expect(DB_NAME).toBe("test_db");
    expect(COLLECTION_NAME).toBe("test_collection");
    expect(MONGO_USERNAME).toBe("test_user");
    expect(MONGO_PASSWORD).toBe("test_password");
  });

  test("should throw an error if required variables are missing", () => {

    dotenv.config = jest.fn(() => {
      // Simulate dotenv.config by assigning values to process.env
      process.env.MONGO_URI = "mongodb://test_uri";
      process.env.DB_NAME = "test_db";
      process.env.COLLECTION_NAME = "test_collection";
      process.env.MONGO_USERNAME = "test_user";
      process.env.MONGO_PASSWORD = "test_password";
    });

    dotenv.config();
    delete process.env.COLLECTION_NAME; 
    expect(() => loadEnv()).toThrow("Missing required environment variables: COLLECTION_NAME");
  });

  test("should throw an error if MONGO_URI is missing", () => {
    process.env.DB_NAME = "test_db";
    process.env.COLLECTION_NAME = "test_collection";
    process.env.MONGO_USERNAME = "test_user";
    process.env.MONGO_PASSWORD = "test_password";

    expect(() => loadEnv()).toThrow("Missing required environment variables: MONGO_URI");
  });

  test("should throw an error if DB_NAME is missing", () => {
    process.env.MONGO_URI = "mongodb://test_uri";
    process.env.COLLECTION_NAME = "test_collection";
    process.env.MONGO_USERNAME = "test_user";
    process.env.MONGO_PASSWORD = "test_password";

    expect(() => loadEnv()).toThrow("Missing required environment variables: DB_NAME");
  });

  test("should throw an error if COLLECTION_NAME is missing", () => {
    process.env.MONGO_URI = "mongodb://test_uri";
    process.env.DB_NAME = "test_db";
    process.env.MONGO_USERNAME = "test_user";
    process.env.MONGO_PASSWORD = "test_password";

    expect(() => loadEnv()).toThrow("Missing required environment variables: COLLECTION_NAME");
  });

  test("should throw an error if MongoDB credentials are missing", () => {
    dotenv.config = jest.fn(() => {
      process.env.MONGO_URI = "mongodb://test_uri";
      process.env.DB_NAME = "test_db";
      process.env.COLLECTION_NAME = "test_collection";
    });

    dotenv.config();
    expect(() => loadEnv()).toThrow("Missing required environment variables: MONGO_USERNAME, MONGO_PASSWORD");
  });

  test("should throw an error if MONGO_USERNAME is missing", () => {
    process.env.MONGO_URI = "mongodb://test_uri";
    process.env.DB_NAME = "test_db";
    process.env.COLLECTION_NAME = "test_collection";
    process.env.MONGO_PASSWORD = "test_password";

    expect(() => loadEnv()).toThrow("Missing required environment variables: MONGO_USERNAME");
  });

  test("should throw an error if MONGO_PASSWORD is missing", () => {
    process.env.MONGO_URI = "mongodb://test_uri";
    process.env.DB_NAME = "test_db";
    process.env.COLLECTION_NAME = "test_collection";
    process.env.MONGO_USERNAME = "test_user";

    expect(() => loadEnv()).toThrow("Missing required environment variables: MONGO_PASSWORD");
  });

  test("should throw an error if multiple environment variables are missing", () => {
    process.env.MONGO_URI = "mongodb://test_uri";

    expect(() => loadEnv()).toThrow(
      "Missing required environment variables: DB_NAME, COLLECTION_NAME, MONGO_USERNAME, MONGO_PASSWORD"
    );
  });

  test("should not throw an error when all variables are present", () => {
    process.env.MONGO_URI = "mongodb://test_uri";
    process.env.DB_NAME = "test_db";
    process.env.COLLECTION_NAME = "test_collection";
    process.env.MONGO_USERNAME = "test_user";
    process.env.MONGO_PASSWORD = "test_password";

    expect(() => loadEnv()).not.toThrow();
  });

});

describe("Command Line Options - Tests", () => {
  let mockConsoleLog;
  let originalConsoleLog;
  let mockExit;

  beforeEach(() => {
    // Save original console.log
    originalConsoleLog = console.log;
    // Create a mock function for console.log
    mockConsoleLog = jest.fn();
    console.log = mockConsoleLog;
    
    // Mock process.exit
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    
    // Reset process.argv
    process.argv = ['node', 'seed.js'];
  });

  afterEach(() => {
    // Restore original console.log
    console.log = originalConsoleLog;
    mockExit.mockRestore();
  });

  test("should use default file path if none is provided", () => {
    const program = parseArgs();
    expect(program.opts().file).toBe("auction_items.json");
  });

  test("should display version when --version option used", () => {
    process.argv.push('--version');
    const program = parseArgs();
    
    // Version info should be stored in program.versionOutput
    expect(program.versionOutput).toContain("Auction Items Seeder v1.0.0");
    expect(program.versionOutput).toContain("Copyright (c) 2024 Astrotope");
  });

  test("should display help when --help option used", () => {
    const program = parseArgs();
    const helpInfo = program.helpInformation();
    
    expect(helpInfo).toContain("Usage:");
    expect(helpInfo).toContain("Options:");
  });

  test("should accept short and long version of file path option -f & --file", () => {
    // Test short version
    process.argv.push('-f', 'short-test.json');
    let program = parseArgs();
    expect(program.opts().file).toBe('short-test.json');

    // Reset argv and test long version
    process.argv = ['node', 'seed.js', '--file', 'long-test.json'];
    program = parseArgs();
    expect(program.opts().file).toBe('long-test.json');
  });

  test("should display environment variables when --verbose option used", () => {
    // Set up environment variables
    process.env.MONGO_URI = "test_uri";
    process.env.DB_NAME = "test_db";
    process.env.COLLECTION_NAME = "test_collection";
    process.env.MONGO_USERNAME = "test_user";
    process.env.MONGO_PASSWORD = "test_pass";

    // Set up verbose flag
    process.argv.push('--verbose');
    const program = parseArgs();
    
    if (program.opts().verbose) {
      const envVars = {
        MONGO_URI: process.env.MONGO_URI,
        DB_NAME: process.env.DB_NAME,
        COLLECTION_NAME: process.env.COLLECTION_NAME,
        MONGO_USERNAME: process.env.MONGO_USERNAME,
        MONGO_PASSWORD: process.env.MONGO_PASSWORD
      };
      
      displayEnvironmentVariables(envVars);
      
      expect(mockConsoleLog).toHaveBeenCalledWith('\nEnvironment Variables:');
      expect(mockConsoleLog).toHaveBeenCalledWith('=====================');
      expect(mockConsoleLog).toHaveBeenCalledWith('MONGO_URI: test_uri');
      expect(mockConsoleLog).toHaveBeenCalledWith('MONGO_PASSWORD: ********');
      expect(mockConsoleLog).toHaveBeenCalledWith('=====================\n');
    }
  });
});

describe("JSON File Reader - Tests", () => {
  const fs = require('fs');
  const path = require('path');
  const tempDir = path.join(process.cwd(), 'test', 'temp');
  
  beforeAll(() => {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  test("should read and parse valid JSON file", () => {
    const testData = [{ id: 1, name: "Test Item" }];
    const filePath = path.join(tempDir, 'valid.json');
    fs.writeFileSync(filePath, JSON.stringify(testData));

    const result = readFile(filePath);
    expect(result).toEqual(testData);
  });

  test("should throw error for invalid JSON format", () => {
    const filePath = path.join(tempDir, 'invalid.json');
    fs.writeFileSync(filePath, '{ invalid json }');

    expect(() => readFile(filePath)).toThrow("Invalid JSON format");
  });

  test("should throw error for non-existent file", () => {
    const filePath = path.join(tempDir, 'nonexistent.json');
    
    expect(() => readFile(filePath)).toThrow(/ENOENT/); // File not found error
  });
});

describe("MongoDB Seeder - Tests", () => {
  let mockClient;
  
  beforeEach(() => {
    // Get the mocked client instance
    mockClient = new MongoClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should establish connection to database", async () => {
    const testData = [{ id: 1 }, { id: 2 }];
    const result = await seedMongoDB('mongodb://test', 'testdb', 'testcollection', testData);
    
    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('testdb');
    expect(mockClient.db().collection).toHaveBeenCalledWith('testcollection');
    expect(result).toBe(2);
  });

  test("should throw an error if cannot connect to database", async () => {
    mockClient.connect.mockRejectedValueOnce(new Error('Connection failed'));
    
    await expect(
      seedMongoDB('mongodb://test', 'testdb', 'testcollection', [])
    ).rejects.toThrow('Connection failed');
  });

  test("should load seed data into database/collection", async () => {
    const testData = [{ id: 1 }, { id: 2 }];
    const result = await seedMongoDB('mongodb://test', 'testdb', 'testcollection', testData);
    
    expect(mockClient.db().collection().deleteMany).toHaveBeenCalledWith({});
    expect(mockClient.db().collection().insertMany).toHaveBeenCalledWith(testData);
    expect(result).toBe(2);
  });

  test("should throw an error if cannot load seed data into database", async () => {
    const testData = [{ id: 1 }, { id: 2 }];
    mockClient.db().collection().insertMany.mockRejectedValueOnce(new Error('Insert failed'));
    
    await expect(
      seedMongoDB('mongodb://test', 'testdb', 'testcollection', testData)
    ).rejects.toThrow('Insert failed');
  });

  test("should close database connection even if operation fails", async () => {
    mockClient.db().collection().insertMany.mockRejectedValueOnce(new Error('Insert failed'));
    
    try {
      await seedMongoDB('mongodb://test', 'testdb', 'testcollection', []);
    } catch (error) {
      // Ignore the error
    }
    
    expect(mockClient.close).toHaveBeenCalled();
  });
});
```

- CLI Tool Code - seed.js

```javascript
const dotenv = require("dotenv");
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

dotenv.config();

function loadEnv() {

  const { MONGO_URI, DB_NAME, COLLECTION_NAME, MONGO_USERNAME, MONGO_PASSWORD } = process.env;

  // console.log(`MONGO_URI: ${MONGO_URI}, DB_NAME: ${DB_NAME}, COLLECTION_NAME: ${COLLECTION_NAME}, MONGO_USERNAME: ${MONGO_USERNAME}`)

  // Collect missing variables
  const missingVars = [];
  if (!MONGO_URI) missingVars.push("MONGO_URI");
  if (!DB_NAME) missingVars.push("DB_NAME");
  if (!COLLECTION_NAME) missingVars.push("COLLECTION_NAME");
  if (!MONGO_USERNAME) missingVars.push("MONGO_USERNAME");
  if (!MONGO_PASSWORD) missingVars.push("MONGO_PASSWORD");

  // Throw an error if any variables are missing
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }

  return { MONGO_URI, DB_NAME, COLLECTION_NAME, MONGO_USERNAME, MONGO_PASSWORD };
};

function getVersionInfo() {
  return `Auction Items Seeder v1.0.0
A MongoDB seeding tool for auction items
Copyright (c) 2024 Astrotope
Created by: Cameron McEwing`;
}

function displayEnvironmentVariables(envVars) {
  console.log('\nEnvironment Variables:');
  console.log('=====================');
  Object.entries(envVars).forEach(([key, value]) => {
    // Don't display the actual password value for security
    const displayValue = key === 'MONGO_PASSWORD' ? '********' : value;
    console.log(`${key}: ${displayValue}`);
  });
  console.log('=====================\n');
}

function parseArgs() {
  const program = new Command();
  
  // Store the version info so we can access it in tests
  program.versionOutput = getVersionInfo();
  
  program
    .name('seed')
    .version(program.versionOutput, '-v, --version', 'Display version information')
    .description("Auction Items Seeder for MongoDB")
    .option("-f, --file <path>", "Path to the JSON file containing auction items", "auction_items.json")
    .option("--verbose", "Display environment variables and additional information")

  program.parse(process.argv);
  return program;
}

function readFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON format");
    }
    throw error;
  }
}

async function seedMongoDB(uri, dbName, collectionName, data) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({});
    const result = await collection.insertMany(data);

    return result.insertedCount;
  } finally {
    await client.close();
  }
}

// Only run the CLI commands when this file is run directly
if (require.main === module) {
  (async () => {
    try {
      const envVars = loadEnv();
      const program = parseArgs();
      const opts = program.opts();
      
      if (opts.verbose) {
        displayEnvironmentVariables(envVars);
      }

      const filePath = path.resolve(process.cwd(), opts.file);
      const data = readFile(filePath);
      
      if (opts.verbose) {
        console.log(`\nRead ${data.length} items from ${opts.file}`);
      }

      const { MONGO_URI, DB_NAME, COLLECTION_NAME, MONGO_USERNAME, MONGO_PASSWORD } = envVars;
      
      // Build the MongoDB connection URI with credentials
      const uri = MONGO_URI.replace(
        'mongodb://',
        `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@`
      );

      if (opts.verbose) {
        console.log(`\nConnecting to MongoDB with URI: ${uri}`);
      }

      const insertedCount = await seedMongoDB(uri, DB_NAME, COLLECTION_NAME, data);
      
      if (opts.verbose) {
        console.log(`\nSuccessfully seeded ${insertedCount} items to MongoDB`);
      }

    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  })();
}

module.exports = { 
  loadEnv, 
  parseArgs, 
  displayEnvironmentVariables, 
  getVersionInfo,
  readFile,
  seedMongoDB 
};
```

- Test Run

```bash
npm test

> src@1.0.0 test
> jest

Auction Items Seeder v1.0.0
A MongoDB seeding tool for auction items
Copyright (c) 2024 Astrotope
Created by: Cameron McEwing
 PASS  test/seed.test.js
  Environment Variables Loader - Tests
    ✓ should load environment variables from .env file (9 ms)
    ✓ should throw an error if required variables are missing (37 ms)
    ✓ should throw an error if MONGO_URI is missing (1 ms)
    ✓ should throw an error if DB_NAME is missing (1 ms)
    ✓ should throw an error if COLLECTION_NAME is missing (2 ms)
    ✓ should throw an error if MongoDB credentials are missing (1 ms)
    ✓ should throw an error if MONGO_USERNAME is missing (1 ms)
    ✓ should throw an error if MONGO_PASSWORD is missing (1 ms)
    ✓ should throw an error if multiple environment variables are missing (1 ms)
    ✓ should not throw an error when all variables are present (1 ms)
  Command Line Options - Tests
    ✓ should use default file path if none is provided (4 ms)
    ✓ should display version when --version option used (1 ms)
    ✓ should display help when --help option used (2 ms)
    ✓ should accept short and long version of file path option -f & --file (1 ms)
    ✓ should display environment variables when --verbose option used (3 ms)
  JSON File Reader - Tests
    ✓ should read and parse valid JSON file (11 ms)
    ✓ should throw error for invalid JSON format (2 ms)
    ✓ should throw error for non-existent file (20 ms)
  MongoDB Seeder - Tests
    ✓ should establish connection to database (1 ms)
    ✓ should throw an error if cannot connect to database (1 ms)
    ✓ should load seed data into database/collection (1 ms)
    ✓ should throw an error if cannot load seed data into database (1 ms)
    ✓ should close database connection even if operation fails (1 ms)

^[[A----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   71.42 |    65.38 |    87.5 |   69.23 |
 seed.js  |   71.42 |    65.38 |    87.5 |   69.23 | 96-133
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 skipped, 1 passed, 1 of 2 total
Tests:       2 skipped, 23 passed, 25 total
Snapshots:   0 total
Time:        4.35 s, estimated 5 s
Ran all test suites.
```

---


### Step 05 - Create MongoDB Integration Tests

- Test Code - seed.integration.test.js

```javascript
const { GenericContainer } = require("testcontainers");
const { MongoClient } = require("mongodb");
const { seedMongoDB } = require("../src/seed");

// Skip all tests in this file unless RUN_INTEGRATION_TESTS is set
const describeIf = process.env.RUN_INTEGRATION_TESTS ? describe : describe.skip;

describeIf("MongoDB Integration Tests", () => {
  jest.setTimeout(30000); // Increase timeout to 30 seconds
  
  let container;
  let mongoUri;
  const testData = [
    { id: 1, name: "Test Item 1", price: 100 },
    { id: 2, name: "Test Item 2", price: 200 }
  ];

  beforeAll(async () => {
    try {
      container = await new GenericContainer("mongo:latest")
        .withExposedPorts(27017)
        .start();
      
      mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;
      console.log('MongoDB container started successfully');
      console.log(`MongoDB URI: ${mongoUri}`);
    } catch (error) {
      console.error('Failed to start MongoDB container:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (container) {
      try {
        await container.stop();
        console.log('MongoDB container stopped successfully');
      } catch (error) {
        console.error('Failed to stop MongoDB container:', error);
      }
    }
  });

  test("should successfully seed data into MongoDB container", async () => {
    // Seed the database
    const insertedCount = await seedMongoDB(mongoUri, "testdb", "auctions", testData);
    expect(insertedCount).toBe(2);

    // Verify the data was actually inserted
    const client = new MongoClient(mongoUri);
    await client.connect();
    
    try {
      const documents = await client.db("testdb")
        .collection("auctions")
        .find({})
        .toArray();
      
      expect(documents.length).toBe(2);
      expect(documents).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: "Test Item 1", price: 100 }),
        expect.objectContaining({ name: "Test Item 2", price: 200 })
      ]));
    } finally {
      await client.close();
    }
  });

  test("should clear existing data before seeding", async () => {
    // First seed
    await seedMongoDB(mongoUri, "testdb", "auctions", testData);
    
    // Second seed with different data
    const newData = [{ id: 3, name: "New Item", price: 300 }];
    const insertedCount = await seedMongoDB(mongoUri, "testdb", "auctions", newData);
    
    // Verify only new data exists
    const client = new MongoClient(mongoUri);
    await client.connect();
    
    try {
      const documents = await client.db("testdb")
        .collection("auctions")
        .find({})
        .toArray();
      
      expect(documents.length).toBe(1);
      expect(documents[0]).toEqual(expect.objectContaining({
        name: "New Item",
        price: 300
      }));
    } finally {
      await client.close();
    }
  });
});
```

- CLI Tool Code - seed.js

```javascript
const dotenv = require("dotenv");
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

dotenv.config();

function loadEnv() {

  const { MONGO_URI, DB_NAME, COLLECTION_NAME, MONGO_USERNAME, MONGO_PASSWORD } = process.env;

  // console.log(`MONGO_URI: ${MONGO_URI}, DB_NAME: ${DB_NAME}, COLLECTION_NAME: ${COLLECTION_NAME}, MONGO_USERNAME: ${MONGO_USERNAME}`)

  // Collect missing variables
  const missingVars = [];
  if (!MONGO_URI) missingVars.push("MONGO_URI");
  if (!DB_NAME) missingVars.push("DB_NAME");
  if (!COLLECTION_NAME) missingVars.push("COLLECTION_NAME");
  if (!MONGO_USERNAME) missingVars.push("MONGO_USERNAME");
  if (!MONGO_PASSWORD) missingVars.push("MONGO_PASSWORD");

  // Throw an error if any variables are missing
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }

  return { MONGO_URI, DB_NAME, COLLECTION_NAME, MONGO_USERNAME, MONGO_PASSWORD };
};

function getVersionInfo() {
  return `Auction Items Seeder v1.0.0
A MongoDB seeding tool for auction items
Copyright (c) 2024 Astrotope
Created by: Cameron McEwing`;
}

function displayEnvironmentVariables(envVars) {
  console.log('\nEnvironment Variables:');
  console.log('=====================');
  Object.entries(envVars).forEach(([key, value]) => {
    // Don't display the actual password value for security
    const displayValue = key === 'MONGO_PASSWORD' ? '********' : value;
    console.log(`${key}: ${displayValue}`);
  });
  console.log('=====================\n');
}

function parseArgs() {
  const program = new Command();
  
  // Store the version info so we can access it in tests
  program.versionOutput = getVersionInfo();
  
  program
    .name('seed')
    .version(program.versionOutput, '-v, --version', 'Display version information')
    .description("Auction Items Seeder for MongoDB")
    .option("-f, --file <path>", "Path to the JSON file containing auction items", "auction_items.json")
    .option("--verbose", "Display environment variables and additional information")

  program.parse(process.argv);
  return program;
}

function readFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON format");
    }
    throw error;
  }
}

async function seedMongoDB(uri, dbName, collectionName, data) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({});
    const result = await collection.insertMany(data);

    return result.insertedCount;
  } finally {
    await client.close();
  }
}

// Only run the CLI commands when this file is run directly
if (require.main === module) {
  (async () => {
    try {
      const envVars = loadEnv();
      const program = parseArgs();
      const opts = program.opts();
      
      if (opts.verbose) {
        displayEnvironmentVariables(envVars);
      }

      const filePath = path.resolve(process.cwd(), opts.file);
      const data = readFile(filePath);
      
      if (opts.verbose) {
        console.log(`\nRead ${data.length} items from ${opts.file}`);
      }

      const { MONGO_URI, DB_NAME, COLLECTION_NAME, MONGO_USERNAME, MONGO_PASSWORD } = envVars;
      
      // Build the MongoDB connection URI with credentials
      const uri = MONGO_URI.replace(
        'mongodb://',
        `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@`
      );

      if (opts.verbose) {
        console.log(`\nConnecting to MongoDB with URI: ${uri}`);
      }

      const insertedCount = await seedMongoDB(uri, DB_NAME, COLLECTION_NAME, data);
      
      if (opts.verbose) {
        console.log(`\nSuccessfully seeded ${insertedCount} items to MongoDB`);
      }

    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  })();
}

module.exports = { 
  loadEnv, 
  parseArgs, 
  displayEnvironmentVariables, 
  getVersionInfo,
  readFile,
  seedMongoDB 
};
```

- Test Run

```bash
npm run test:all

> src@1.0.0 test:all
> RUN_INTEGRATION_TESTS=1 jest

Auction Items Seeder v1.0.0
A MongoDB seeding tool for auction items
Copyright (c) 2024 Astrotope
Created by: Cameron McEwing

 PASS  test/seed.test.js
  Environment Variables Loader - Tests
    ✓ should load environment variables from .env file (8 ms)
    ✓ should throw an error if required variables are missing (18 ms)
    ✓ should throw an error if MONGO_URI is missing (1 ms)
    ✓ should throw an error if DB_NAME is missing (2 ms)
    ✓ should throw an error if COLLECTION_NAME is missing (1 ms)
    ✓ should throw an error if MongoDB credentials are missing (1 ms)
    ✓ should throw an error if MONGO_USERNAME is missing (1 ms)
    ✓ should throw an error if MONGO_PASSWORD is missing (1 ms)
    ✓ should throw an error if multiple environment variables are missing (1 ms)
    ✓ should not throw an error when all variables are present (1 ms)
  Command Line Options - Tests
    ✓ should use default file path if none is provided (3 ms)
    ✓ should display version when --version option used (1 ms)
    ✓ should display help when --help option used (2 ms)
    ✓ should accept short and long version of file path option -f & --file (1 ms)
    ✓ should display environment variables when --verbose option used (2 ms)
  JSON File Reader - Tests
    ✓ should read and parse valid JSON file (9 ms)
    ✓ should throw error for invalid JSON format (1 ms)
    ✓ should throw error for non-existent file (18 ms)
  MongoDB Seeder - Tests
    ✓ should establish connection to database (1 ms)
    ✓ should throw an error if cannot connect to database (1 ms)
    ✓ should load seed data into database/collection (1 ms)
    ✓ should throw an error if cannot load seed data into database (1 ms)
    ✓ should close database connection even if operation fails

  console.log
    MongoDB container started successfully

      at Object.log (test/seed.integration.test.js:25:15)

  console.log
    MongoDB URI: mongodb://localhost:55007

      at Object.log (test/seed.integration.test.js:26:15)

  console.log
    MongoDB container stopped successfully

      at Object.log (test/seed.integration.test.js:37:17)

 PASS  test/seed.integration.test.js
  MongoDB Integration Tests
    ✓ should successfully seed data into MongoDB container (86 ms)
    ✓ should clear existing data before seeding (42 ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   71.42 |    65.38 |    87.5 |   69.23 |
 seed.js  |   71.42 |    65.38 |    87.5 |   69.23 | 96-133
----------|---------|----------|---------|---------|-------------------
Test Suites: 2 passed, 2 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        5.458 s
Ran all test suites.
```

---
