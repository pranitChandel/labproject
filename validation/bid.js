const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateBidInput(data) {
  let errors = {};

  data.bidprice = !isEmpty(data.bidprice) ? data.bidprice : "";

  if (!Validator.isLength(data.bidprice, { min: 2, max: 10 })) {
    errors.bidprice = "Bidprice atleast 50";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
