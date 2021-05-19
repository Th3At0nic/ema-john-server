const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5000;
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hz5rx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  console.log("database connected");

  app.post("/addProducts", (req, res) => {
    const products = req.body;
    console.log(products);
    productsCollection.insertOne(products).then((result) => {
      console.log(result.insertedCount);
      res.send(result);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/productsByKeys", (req, res) => {
    const productKyes = req.body;
    productsCollection
      .find({ key: { $in: productKyes } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/addOrder", (req, res) => {
    const orders = req.body;
    console.log(orders);
    ordersCollection.insertOne(orders).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port);
console.log("listen on port 5000");
