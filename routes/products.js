const express = require("express");
const router = express.Router({ mergeParams: true });

const { createProduct, deleteProduct, getProduct } = require("../handlers/products");

router.route("/").post(createProduct);

router
  .route("/:product_id")
  .get(getProduct)  
  .delete(deleteProduct);

module.exports = router;