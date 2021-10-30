const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// function

const run = async () => {
  try {
    // DB connection
    await client.connect();
    const database = client.db("Touropia");
    const serviceCollection = database.collection("services");
    const bookingCollection = database.collection("userBooking");

    // POST api (sending data feom UI to server)
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.json(result);
    });
    // POST api (sending booking details to server)
    app.post("/booking", async (req, res) => {
      const newBooking = req.body;
      const result = await bookingCollection.insertOne(newBooking);
      res.json(result);
    });
    // Get Api (Loading service data from server)
    app.get("/services", async (req, res) => {
      const services = await serviceCollection.find({}).toArray();
      res.send(services);
    });
    // Get Api (Loading booking data from server)
    app.get("/booking", async (req, res) => {
      const booking = await bookingCollection.find({}).toArray();
      res.send(booking);
    });

    // Load data dynamically
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // load data by user email
    app.get('/mybooking/:email', async(req, res)=>{
      const result = await bookingCollection.find({
        email: req.params.email
      }).toArray()
      res.send(result)
    })
  } finally {
    // await client.close();
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Travel Server");
});
app.listen(port, () => {
  console.log(`Running my server on port ${port}`);
});
