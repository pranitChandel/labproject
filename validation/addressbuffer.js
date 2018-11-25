const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddressbufferInput(data) {
  let errors = {};

  data.pincode = !isEmpty(data.pincode) ? data.pincode : "";
  data.addressline1 = !isEmpty(data.addressline1) ? data.addressline1 : "";
  data.addressline2 = !isEmpty(data.addressline2) ? data.addressline2 : "";
  data.addressline3 = !isEmpty(data.addressline3) ? data.addressline3 : "";
  data.landmark = !isEmpty(data.landmark) ? data.landmark : "";
  data.cityname = !isEmpty(data.cityname) ? data.cityname : "";
  data.statename = !isEmpty(data.statename) ? data.statename : "";

  if (!Validator.isPostalCode(data.pincode.toString(), "IN")) {
    errors.pincode = "Pincode should be 6 digits long ";
  }
  if (Validator.isEmpty(data.pincode)) {
    errors.pincode = "Pincode is required";
  }
  if (!Validator.isLength(data.addressline1, { max: 60 })) {
    errors.addressline1 = " Maximum 60 characters ";
  }
  if (Validator.isEmpty(data.addressline1)) {
    errors.addressline1 = "Address is required";
  }
  if (!isEmpty(data.addressline2)) {
    if (!Validator.isLength(data.addressline2, { max: 60 })) {
      errors.addressline2 = " Maximum 60 characters";
    }
  }
  if (!isEmpty(data.addressline3)) {
    if (!Validator.isLength(data.addressline3, { max: 60 })) {
      errors.addressline3 = " Maximum 60 characters";
    }
  }
  if (!Validator.isLength(data.landmark, { max: 60 })) {
    errors.landmark = "Maximum 60 characters";
  }

  if (Validator.isEmpty(data.cityname)) {
    errors.cityname = "city field is required";
  }
  if (Validator.isEmpty(data.statename)) {
    errors.statename = "state field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
