const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jlioc3w.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const studentCollection = client.db("school").collection("students");
    const commentCollection = client.db("school").collection("comments");
    const productCollection = client.db("school").collection("products");

    app.get("/students", async (req, res) => {
      const result = await studentCollection.find().toArray();
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    app.get("/comments", async (req, res) => {
      const result = await commentCollection.find().toArray();
      res.send(result);
    });

    app.post("/students", async (req, res) => {
      const newStudent = req.body;
      const result = await studentCollection.insertOne(newStudent);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.post("/comments", async (req, res) => {
      const newComment = req.body;
      const result = await commentCollection.insertOne(newComment);
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const {_id, ...updateDoc} = req.body;
      const productToBeUpdated = {
        $set: updateDoc,
      };
      
      const result = await productCollection.updateOne(
        query,
        productToBeUpdated
      );
      res.send(result);
    });

    app.put("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const {_id, ...updateDoc} = req.body;
      const commentToBeUpdated = {
        $set: updateDoc,
      };
      const result = await commentCollection.updateOne(
        query,
        commentToBeUpdated
      );
      res.send(result);
    });

    app.delete("/products/:productId", async (req, res) => {
      const productId = req.params.productId;
      const query = { id: productId };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("school is open");
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
