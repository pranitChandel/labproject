const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateBidInput(data) {
  let errors = {};

  data.bidprice = !isEmpty(data.bidprice) ? data.bidprice : "";
  data.BiddingProductid = !isEmpty(data.BiddingProductid)
    ? data.BiddingProductid
    : "";

  if (!Validator.isLength(data.bidprice, { min: 3, max: 10000000000000000 })) {
    errors.bidprice = "Bidprice atleast 100";
  }
  if (Validator.isEmpty(data.bidprice)) {
    errors.bidprice = "Bid price required";
  }

  if (Validator.isEmpty(data.BiddingProductid)) {
    errors.BiddingProductid = "Select a product";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
