const express = require("express");
const cors = require("cors");
require("dotenv").config();
const capsuleRoutes = require('./capsuleRoutes.js');
const letterRoutes = require('./letterRoutes.js');
const photoRoutes = require('./photoRoutes.js');


const { MongoClient, ServerApiVersion } = require("mongodb")
const uri = process.env.MONGO_URI

const app = express();
const PORT = process.env.INDEX_PORT || 5001;

// Middleware
app.use(cors({}));
app.use(express.json());

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

      app.locals.db = client.db('TimesnapDB')
      app.use('/api', capsuleRoutes);
      app.use('/api', letterRoutes);
      app.use('/api', photoRoutes);

      // const userId = addUser('Harris', 'h.s.kim@wustl.edu')
      // console.log("Added user with ID:", userId);
      // const user = retriveUserById()
      
    } catch (error) {
      console.error("Error connecting to MongoDB:", error)
      process.exit(1) // Stop the server if we cannot connect
    }
  }
  
// 5) Call the function to connect to MongoDB when the server starts
connectDB()

// Test API Route
app.get("/", (req, res) => {
    res.send("Hello from Node.js backend!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { addUser, retrieveUserById };


//mongo functions
async function addUser(username, email, id) {
  try {
      const users = app.locals.db.collection("users");
      if (!users) throw new Error("Database not connected yet");
      if (!id) throw new Error("connect to google")

      const newUser = {
        _id: id,
        username, 
        email, 
        friends: [],
        profileImageId: null
      };
      const result = await users.insertOne(newUser);
      console.log("User added with ID:", result.insertedId);
      return result.insertedId;
  } catch (error) {
      console.error("Error adding user:", error);
  }
}

async function retrieveUserById(userId) {
  try {
    const users = app.locals.db.collection("users");
    if (!users) throw new Error("Database not connected yet");
    return await users.findOne({ _id: userId });

  } catch (error) {
    console.error("Error retrieving user:", error);
  }
}

async function retrieveUserByEmail(userEmail) {
  try {
    const users = app.locals.db.collection("users");
    if (!users) throw new Error("Database not connected yet");
    return await users.findOne({ email: userEmail });

  } catch (error) {
    console.error("Error retrieving user:", error);
  }
}

const PDFDocument = require('pdfkit');
const fs = require('fs');

async function generatePDF(content) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.on('error', reject);

    doc.text(content, {
      align: 'left'
    });

    doc.end();
  });
}

async function retrieveUserCapsules(userId) {
  try {
    const users = app.locals.db.collection("users");
    if (!capsules) throw new Error("Database not connected yet");
    const capsuleArray = await capsules.find({ userId: new ObjectId(userId) }).toArray();
    return capsuleArray;

  } catch (error) {
    console.error("Error adding user:", error);
    return [];
  }
}