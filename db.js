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
const size = 20;
const status = false;

const tradeColl = mongoClient
  .db("BinaryTradingDB")
  .collection("tradeCollection");

async function updateLastTrade(status) {
  const tradeColl = mongoClient
    .db("BinaryTradingDB")
    .collection("tradeCollection");
  const lastTrade = await tradeColl.findOne({}, { sort: { timestamp: -1 } });

  if (lastTrade) {
    await tradeColl.updateOne(
      { _id: lastTrade._id },
      {
        $set: {
          status: status ? "loss" : "win",
        },
      }
    );
    console.log("Updated trade status successfully");
  }
  return lastTrade;
}

async function insertSignal(signal, size) {
  const doc = {
    pair: signal["Pair"],
    duration: signal["Duration"],
    direction: signal["Direction"],
    timestamp: new Date(),
    date: moment().format("YYYY-MM-DD"),
    size: size,
  };
  await tradeColl.insertOne(doc);
  console.log("Inserted new signal in DB succesfully!");
}

// connectDB();
// insertSignal(signal, size);
// updateLastTrade(status);
module.exports = { connectDB, insertSignal, updateLastTrade, mongoClient };
