//helps to handle req  easier
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/RestDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//log request url
app.use(morgan("dev"));

//making a folder static so it is accessable for everyone

app.use(express.static("uploads"));

//for body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//for cors
app.use((req, res, next) => {
  //* means all domain  can  access now you can also specify domain here
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,ContentType, Accept,Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

//routes which should handle request
const ProductRoutes = require("./api/routes/products");
const OrderRoutes = require("./api/routes/orders");
const UserRoutes = require("./api/routes/user");
app.use("/products", ProductRoutes);
app.use("/orders", OrderRoutes);
app.use("/users", UserRoutes);

//if req doesnot matched with  above two router
//than meet below middleware which creates error and forward it via next function
app.use((req, res, next) => {
  const err = new Error("not found");
  err.status = 404;
  next(err);
});

//if an  error found in  database operation or any error forward here
//than below function works
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error.message);

  res.json({
    error: {
      mess: error.message,
      status: error.status,
    },
  });
});

module.exports = app;
