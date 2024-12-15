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
