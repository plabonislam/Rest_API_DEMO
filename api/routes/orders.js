const express = require("express");
const router = express.Router();
const check_auth = require("../middleware/check-auth");
const OrderController = require("../controller/order");

router.get("/", check_auth, OrderController.all_orders);

router.post("/", check_auth, OrderController.create_order);

router.get("/:OrderId", check_auth, OrderController.Get_order);

router.delete("/:OrderId", check_auth, OrderController.delete_order);

module.exports = router;
