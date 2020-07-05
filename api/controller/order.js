
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

exports.all_orders = (req, res, next) => {
  Order.find()
    .select("_id quantity  product")
    .populate("product", "price")
    .exec()
    .then((docs) => {
      console.log(docs);
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            url: {
              type: "GET",
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch();
};

exports.create_order = (req, res, next) => {
  //we  will check first that product id exist
  Product.findById(req.body.productId)
    .exec()
    .then((result) => {
      console.log(result);
      if (!result) {
        return res.status(404).json({
          mess: "Product not found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });

      return order.save();
    })
    .then((result) => {
      res.status(201).json({
        created: "Order IS taken",
        _id: result.id,
        product: result.product,
        quantity: result.quantity,
        response: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      console.log("error");
      res.status(500).json({
        mess: err,
      });
    });
};


exports.Get_order = (req, res, next) => {
  Order.findById(req.params.OrderId)
    .select("quantity _id product")
    .populate("product", "name price")
    .exec()
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          mess: "order not found",
        });
      }
      res.status(200).json({
        doc: doc,
        response: {
          url: "GET",
          path: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        mess: err,
      });
    });
};

exports.delete_order = (req, res, next) => {
  Order.remove({ _id: req.params.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        delet: "Order is deleted Successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
};