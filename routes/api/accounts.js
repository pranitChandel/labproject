const express = require("express");
const router = express.Router();

const passport = require("passport");
const connection = require("../../dbconnection");

//Load Input Validation
const validateAddressbufferInput = require("../../validation/addressbuffer");
const validateAccountInput = require("../../validation/account");
const validateCreditcardInput = require("../../validation/creditcard");
const validateBidInput = require("../../validation/bid");

//@route POST api/accounts
//@desc  Create or edit User Account
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAccountInput(req.body);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    //Get Fields
    const accountFields = {};
    accountFields.Userid = req.user[0].Userid;
    if (req.body.handle) accountFields.handle = req.body.handle;
    if (req.body.phonenumber) accountFields.phonenumber = req.body.phonenumber;

    const selectQuery = "SELECT * FROM Account WHERE Userid = ?";
    connection.query(selectQuery, [accountFields.Userid], (err, result) => {
      console.log(result[0]);
      if (result[0] === undefined) {
        const selectQuery = "SELECT handle FROM Account";
        connection.query(selectQuery, (err, result) => {
          console.log(result.length);
          if (result.handle === accountFields.handle) {
            errors.handle = "Handle already taken";
            res.status(400).json(errors);
          } else {
            const insertQuery =
              "INSERT INTO Account (handle,phonenumber,Userid) VALUES (?,?,?)";
            connection.query(
              insertQuery,
              [
                accountFields.handle,
                accountFields.phonenumber,
                accountFields.Userid
              ],
              (err, rows) => {
                console.log("insert");
                //accountFields.Accountid = rows.insertedId;
                res.json(accountFields);
              }
            );
          }
        });
      } else {
        const selectQuery2 = "SELECT * FROM Account WHERE Accountid = ?";
        connection.query(
          selectQuery2,
          [accountFields.Accountid],
          (err, result) => {
            console.log(result.length);
            if (result.length != 0) {
              const updateQuery = "UPDATE Account SET ? WHERE Userid = ?";
              console.log("else update");
              connection.query(
                updateQuery,
                [accountFields, accountFields.Userid],
                (err, result) => {
                  res.json(accountFields);
                }
              );
            } else {
              console.log(" if handle error1");
              errors.handle = "Handle already taken";
              res.status(400).json(errors);
            }
          }
        );
      }
      //console.log(result[0].handle);
    });
  }
);

//@route POST api/accounts/cardinfo
//@desc  Add cardinfo to account
//@access Private
router.post(
  "/cardinfo",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCreditcardInput(req.body);

    //Check Validation
    if (!isValid) {
      //Return  any errors with 400 status
      return res.status(400).json(errors);
    }
    const selectQuery = "SELECT Accountid FROM Account WHERE Userid = ?";
    connection.query(selectQuery, [req.user[0].Userid], (err, result) => {
      //console.log(result);

      const newCard = {
        cardholdername: req.body.cardholdername,
        cardnumber: req.body.cardnumber,
        expirationdate: req.body.expirationdate,
        cvv: req.body.cvv,
        Accountid: result[0].Accountid
      };
      const insertQuery =
        "INSERT INTO CardInfo (cardholdername,cardnumber,expirationdate,cvv,Accountid) VALUES (?,?,?,?,?)";
      console.log(newCard);
      connection.query(
        insertQuery,
        [
          newCard.cardholdername,
          newCard.cardnumber,
          newCard.expirationdate,
          newCard.cvv,
          newCard.Accountid
        ],
        (err, rows) => {
          //newCard.CardIndoid = rows.insertedId;
          res.json(newCard);
        }
      );
    });
  }
);

//@route POST api/accounts/addressbuffer
//@desc  Add address in Account
//@access Private
router.post(
  "/addressbuffer",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddressbufferInput(req.body);

    //Check Validation
    if (!isValid) {
      //Return  any errors with 400 status
      return res.status(400).json(errors);
    }
    const selectQuery = "SELECT Accountid FROM Account WHERE Userid = ?";
    connection.query(selectQuery, [req.user[0].Userid], (err, result) => {
      //console.log(result);

      const newAddress = {
        pincode: req.body.pincode,
        addressline1: req.body.addressline1,
        addressline2: req.body.addressline2,
        addressline3: req.body.addressline3,
        landmark: req.body.landmark,
        cityname: req.body.cityname,
        statename: req.body.statename,
        Accountid: result[0].Accountid
      };
      const insertQuery =
        "INSERT INTO Address (pincode,addressline1,addressline2,addressline3,landmark,cityname,statename,Accountid) VALUES (?,?,?,?,?,?,?,?)";

      connection.query(
        insertQuery,
        [
          newAddress.pincode,
          newAddress.addressline1,
          newAddress.addressline2,
          newAddress.addressline3,
          newAddress.landmark,
          newAddress.cityname,
          newAddress.statename,
          newAddress.Accountid
        ],
        (err, rows) => {
          //newCard.CardIndoid = rows.insertedId;
          res.json(newAddress);
        }
      );
    });
  }
);

//@route POST api/accounts/bidding/:biddingproduct_id
//@desc  Make a bid
//@access Private
router.post(
  "/bidding/:biddingproduct_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateBidInput(req.body);

    //Check Validation
    if (!isValid) {
      //Return  any errors with 400 status
      return res.status(400).json(errors);
    }
    const id = req.user[0].Userid;

    const selectQuery = "SELECT Accountid FROM Account WHERE Userid = ?";
    connection.query(selectQuery, [id], (err, result) => {
      const newBid = {
        bidprice: req.body.bidprice,
        Accountid: result[0].Accountid,
        BiddingProductid: req.params.biddingproduct_id
      };
      const selectQuery2 =
        "SELECT BiddingProductid FROM BiddedProduct WHERE BiddingProductid = ?";
      connection.query(
        selectQuery2,
        [newBid.BiddingProductid],
        (err, result) => {
          if (result.length > 0) {
            const updateQuery =
              "UPDATE BiddedProduct SET ? WHERE BiddingProductid = ?";
            connection.query(
              updateQuery,
              [newBid, newBid.BiddingProductid],
              (err, result) => {
                console.log("updated");
                res.json(newBid);
              }
            );
          } else {
            const insertQuery =
              "INSERT INTO BiddedProduct (bidprice,date,Accountid,BiddingProductid) VALUES (?,NOW(),?,?)";
            connection.query(
              insertQuery,
              [newBid.bidprice, newBid.Accountid, newBid.BiddingProductid],
              (err, result) => {
                console.log("inserted");
                res.json(newBid);
              }
            );
          }
        }
      );
    });
  }
);

//@route DELETE api/accounts/addressbuffer/:Addressid
//@desc  Delete address from account
//@access Private
router.delete(
  "/addressbuffer/:Addressid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const selectQuery = "SELECT Accountid FROM Account WHERE Userid = ?";
    connection.query(selectQuery, [req.user[0].Userid], (err, result) => {
      const removeid = req.params.Addressid;

      const deleteQuery = "DELETE FROM Address WHERE addressid = ?";
      connection.query(deleteQuery, [removeid], (err, result) => {
        res.json(result);
      });
    });
  }
);

//@route DELETE api/accounts
//@desc  Delete user and account
//@access Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const selectQuery = "SELECT * FROM Account WHERE Userid = ?";
    const id = req.user[0].Userid;
    connection.query(selectQuery, [id], (err, result) => {
      //console.log(result[]);
      const deleteQuery = "DELETE FROM Account WHERE Accountid = ?";
      connection.query(deleteQuery, [result[0].Accountid], (err, result) => {
        //console.log(result[0].Accountid);
        res.json("Success");
      });
    });
  }
);

module.exports = router;
