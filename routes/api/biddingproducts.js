const express = require("express");
const router = express.Router();
const connection = require("../../dbconnection");

//@route GET api/biddingproducts/all
//@desc  Get all biddingproducts
//@access Public
router.get("/all", (req, res) => {
  const errors = {};
  const selectQuery = "SELECT * FROM BiddingProduct";
  connection.query(selectQuery, (err, result) => {
    res.json(result);
  });
});

//@route GET api/biddingproducts/biddingproductname/:biddingproductname
//@desc  Get BiddingProduct by biddingproductname
//@access Public
router.get("/biddingproductname/:biddingproductname", (req, res) => {
  const selectQuery = "SELECT * FROM BiddingProduct WHERE productname = ?";
  connection.query(
    selectQuery,
    [req.params.biddingproductname],
    (err, result) => {
      res.json(result);
    }
  );
});

//@route GET api/biddingproducts/biddingproduct/:biddingproduct_id
//@desc  Get Account by user ID
//@access Public
router.get("/biddingproduct/:biddingproduct_id", (req, res) => {
  const selectQuery = "SELECT * FROM BiddingProduct WHERE BiddingProductid = ?";
  connection.query(
    selectQuery,
    [req.params.biddingproduct_id],
    (err, result) => {
      res.json(result);
    }
  );
});

//@route POST api/biddingproducts
//@desc  Create or edit BiddingProducts
//@access Public
router.post("/", (req, res) => {
  const selectQuery = "SELECT * FROM BiddingProduct WHERE productname = ?";
  connection.query(selectQuery, [req.body.productname], (err, result) => {
    if (result.length > 0) {
      errors.productname = "Product name already exists";
      return res.status(400).json(errors);
    }
    const newProduct = {
      productname: req.body.productname,
      bidperiod: req.body.bidperiod,
      startingbidprice: req.body.startingbidprice
    };
    const insertQuery =
      "INSERT INTO BiddingProduct (productname,bidperiod,startingbidprice) VALUES (?,?,?)";
    connection.query(
      insertQuery,
      [
        newProduct.productname,
        newProduct.bidperiod,
        newProduct.startingbidprice
      ],
      (err, result) => {
        res.json(newProduct);
      }
    );
  });
});

//@route POST api/biddingproducts/items/:product_id
//@desc  Add item to biddingproduct
//@access Public
router.post("/items/:product_id", (req, res) => {
  const insertQuery =
    "INSERT INTO Items (product_itemname,info,price,BiddingProductid) VALUES (?,?,?,?)";
  const newItem = {
    product_itemname: req.body.product_itemname,
    info: req.body.info,
    price: req.body.price,
    BiddingProductid: req.params.product_id
  };
  connection.query(
    insertQuery,
    [
      newItem.product_itemname,
      newItem.info,
      newItem.price,
      newItem.BiddingProductid
    ],
    (err, result) => {
      res.json(newItem);
    }
  );
});

//@route DELETE api/biddingproducts/:biddingproduct_id
//@desc  Delete biddingproduct
//@access Public
router.delete("/:biddingproduct_id", (req, res) => {
  const deleteQuery = "DELETE FROM BiddingProduct WHERE BiddingProductid = ?";
  connection.query(
    deleteQuery,
    [req.params.biddingproduct_id],
    (err, result) => {
      res.json("Success");
    }
  );
});

module.exports = router;
