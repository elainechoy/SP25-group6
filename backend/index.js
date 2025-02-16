const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb")
const uri = process.env.MONGO_URI

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

let db, users, capsules;

async function connectDB() {
    try {
      // Create a MongoClient with a MongoClientOptions object to set the Stable API version
      const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      })
  
      // Connect to your MongoDB cluster
      await client.connect()
      // Optionally, send a ping to confirm successful connection
      await client.db("admin").command({ ping: 1 })
      console.log("Pinged your deployment. You successfully connected to MongoDB!")
  
      // You can store the client or DB on the app, in globals, or in a separate module
      // Example: app.locals.db = client.db("your-database-name")

      db = client.db('TimesnapDB')
      users = db.collection('users')
      capsules = db.collection('capsules')

      // const userId = addUser('Harris', 'h.s.kim@wustl.edu')
      // console.log("Added user with ID:", userId);
      // const user = retriveUserById()
  
    } catch (error) {
      console.error("Error connecting to MongoDB:", error)
      process.exit(1) // Stop the server if we cannot connect
    }
  }
  
  // 5) Call the function to connect to MongoDB when the server starts
  (async () => {
    await connectDB();
  })();
  

// Test API Route
app.get("/", (req, res) => {
    res.send("Hello from Node.js backend!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//mongo functions
async function addUser(username, email) {
  try {
      if (!users) throw new Error("Database not connected yet");

      const newUser = { username, email, friends: [] };
      const result = await users.insertOne(newUser);
      console.log("User added with ID:", result.insertedId);
      return result.insertedId;
  } catch (error) {
      console.error("Error adding user:", error);
  }
}

async function retriveUserById(userId) {
  try {
    if (!users) throw new Error("Database not connected yet");
    return await users.findOne({ _id: new ObjectId(userId) });

  } catch (error) {
    console.error("Error adding user:", error);
  }
}