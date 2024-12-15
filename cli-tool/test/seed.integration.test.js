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