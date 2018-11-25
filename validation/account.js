const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAccountInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.phonenumber = !isEmpty(data.phonenumber) ? data.phonenumber : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be between 2 and 4 characters";
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }

  if (!Validator.isMobilePhone(data.phonenumber.toString(), "en-IN")) {
    errors.phonenumber = "Enter a valid mobile number";
  }

  if (Validator.isEmpty(data.phonenumber)) {
    errors.phonenumber = "Mobile number is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
