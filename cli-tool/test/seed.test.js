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
