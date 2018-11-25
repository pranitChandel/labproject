const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCreditcardInput(data) {
  let errors = {};

  data.cardholdername = !isEmpty(data.cardholdername)
    ? data.cardholdername
    : "";
  data.cardnumber = !isEmpty(data.cardnumber) ? data.cardnumber : "";
  data.expirationdate = !isEmpty(data.expirationdate)
    ? data.expirationdate
    : "";
  data.cvv = !isEmpty(data.cvv) ? data.cvv : "";

  if (Validator.isEmpty(data.cardholdername)) {
    errors.cardholdername = "Cardholder name is required";
  }

  if (!Validator.isLength(data.cardnumber, { min: 16, max: 16 })) {
    errors.cardnumber = "Enter a valid card number";
  }
  if (Validator.isEmpty(data.cardnumber)) {
    errors.cardnumber = "Card number is required";
  }

  if (!Validator.toDate(data.expirationdate.toString())) {
    errors.expirationdate = "Enter a valid validation date";
  }
  if (Validator.isEmpty(data.expirationdate)) {
    errors.expirationdate = "Expiration date is required";
  }

  if (!Validator.isLength(data.cvv, { min: 3, max: 3 })) {
    errors.cvv = "cvv should be 3 characters long";
  }
  if (Validator.isEmpty(data.cvv)) {
    errors.cvv = "cvv is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
