const { MongoClient, ServerApiVersion } = require("mongodb");
const moment = require("moment");
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
const signal = { Pair: "USD/BRL", Direction: "Down", Duration: "05:00" };
async function insertSignal(signal) {
  const tradeColl = mongoClient
    .db("BinaryTradingDB")
    .collection("tradeCollection");
  const lastTrade = await tradeColl.findOne({}, { sort: { timestamp: -1 } });
  console.log(lastTrade);

  const doc = {
    pair: signal["Pair"],
    duration: signal["Duration"],
    direction: signal["Direction"],
    timestamp: new Date(),
    date: moment().format("YYYY-MM-DD"),
  };
  await tradeColl.insertOne(doc);

  return lastTrade;
}

connectDB();
insertSignal(signal);
// module.exports = { connectDB, insertSignal, mongoClient };
