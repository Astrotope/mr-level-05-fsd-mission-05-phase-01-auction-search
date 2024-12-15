// Connect to the "admin" database to create a new user with proper roles
db.createUser({
    user: "admin",
    pwd: "password",
    roles: [{ role: "readWrite", db: "auction" }]
  });
  
  // Switch to the "auction" database
  db = db.getSiblingDB("auction");
  
  // Create the "items" collection if it doesn't already exist
  db.createCollection("auctionItems");
