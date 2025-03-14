const { MongoClient, ServerApiVersion } = require("mongodb");
const { config } = require("dotenv");
config();
const uri = process.env.Mongo_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB successfully!");
  } catch (e) {
    console.log("MongoDB connection error: ", e);
  }
}

module.exports = { connectDB, mongoClient };
