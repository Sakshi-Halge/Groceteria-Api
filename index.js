const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser")

const app = express();
const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8976;
const url =
  "mongodb+srv://m001-student:vedantu123@sandbox.cou6h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

let db;
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Groceteria Api</h1>");
});

//Main Category
app.get("/main_category", (req, res) => {
  db.collection("main_category")
    .find({})
    .toArray((err, data) => {
      if (err) throw err;
      res.send(data);
    });
});

//Sub Category
app.get("/sub_category/:mainCatId", (req, res) => {
  db.collection("sub_category")
    .find({ main_category_id: Number(req.params.mainCatId) })
    .toArray((err, data) => {
      if (err) throw err;
      res.send(data);
    });
});

//all products
app.get("/products", (req, res) => {
  let query = {};
  if (req.query.id) {
    query = { id: Number(req.query.id) };
  }
  db.collection("shopping")
    .find(query)
    .toArray((err, data) => {
      if (err) throw err;
      res.send(data);
    });
});

//offer on products
app.get("/product", (req, res) => {
  let sortKey = { price: 1 };

  let query = {};
  if (req.query.subId && req.query.sortKey) {
    let subId = Number(req.query.subId);
    sortkey = { price: Number(req.query.sortkey) };
    console.log(sortKey)
    console.log("hello")
    query = {
      sub_category_id: subId,
    };
  }
  if (req.query.loffer && req.query.hoffer) {
    let loffer = Number(req.query.loffer);
    let hoffer = Number(req.query.hoffer);

    query = {
      $and: [
        {
          offer: { $gte: loffer, $lte: hoffer },
        },
      ],
    };
  }
  if (req.query.lprice && req.query.hprice) {
    let lprice = Number(req.query.lprice);
    let hprice = Number(req.query.hprice);
    query = {
      $and: [
        {
          price: { $gte: lprice, $lte: hprice },
        },
      ],
    };
  }

  if (req.query.subId) {
    let subId = Number(req.query.subId);
    query = {
      sub_category_id: subId,
    };
  }
  if (req.query.subId && req.query.ldisc && req.query.hdisc) {
    let subId = Number(req.query.subId);
    let ldisc = Number(req.query.ldisc);
    let hdisc = Number(req.query.hdisc);
    query = {
      $and: [
        {
          offer: { $gte: ldisc, $lte: hdisc },
          sub_category_id: subId,
        },
      ],
      // sub_category_id: subId,
      // offer: Number(req.query.discount),
    };
  }
  if (req.query.subId && req.query.lprice && req.query.hprice) {
    let subId = Number(req.query.subId);
    let lprice = Number(req.query.lprice);
    let hprice = Number(req.query.hprice);
    query = {
      $and: [
        {
          price: { $gte: lprice, $lte: hprice },
          sub_category_id: subId,
        },
      ],
    };
  }

  console.log(query);
  db.collection("shopping")
    .find(query)
    .sort(sortKey)
    .toArray((err, data) => {
      if (err) throw err;
      res.send(data);
    });
});


//sort Products
app.get("/sortProducts/:subId", (req, res) => {

  let sortKey = {price : 1};
  let query = {
    sub_category_id: Number(req.params.subId),
  };
  if (req.query.sortKey) {
    sortKey = { price: Number(req.query.sortKey) };
  }

  db.collection("shopping")
    .find(query)
    .sort(sortKey)
    .toArray((err, data) => {
      if (err) throw err;
      res.send(data);
    });
});



//place orders
app.post("/placeorder", (req, res) => {
  console.log(req.body)
  db.collection("orders").insertOne(req.body, (err) => {
    if (err) throw err;
    res.send("order Placed");
  });
});

app.get("/viewOrders/:emailid", (req, res) => {
  let query = {};
  let emailid = req.params.emailid;
  let skip = 0;
  let limit = 1000000000000000;
  if (req.query.skip && req.query.limit) {
    skip = Number(req.query.skip);
    limit = Number(req.query.limit);
  }
  query = { "email": emailid};

  db.collection("orders")
    .find(query)
    .skip(skip)
    .limit(limit)
    .toArray((err, data) => {
      res.send(data);
    });
});

app.delete("/deleteOrder", (req, res) => {
  db.collection("orders").remove({}, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});



//place orders
app.post("/placecart", (req, res) => {
  console.log(req.body)
  db.collection("cart").insertOne(req.body, (err) => {
    if (err) throw err;
    res.send("order Placed");
  });
});

app.get("/viewcart/:emailid", (req, res) => {
  let query = {};
  let emailid = req.params.emailid;
  let skip = 0;
  let limit = 1000000000000000;
  if (req.query.skip && req.query.limit) {
    skip = Number(req.query.skip);
    limit = Number(req.query.limit);
  }
  query = { "email": emailid};

  db.collection("cart")
    .find(query)
    .skip(skip)
    .limit(limit)
    .toArray((err, data) => {
      res.send(data);
    });
});


//Mongodb connection
MongoClient.connect(url, (err, client) => {
  if (err) throw err;
  db = client.db("Groceteria");
  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening on http://localhost:${port}`);
  });
});
