const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/keys");
const passport = require("passport");
const connection = require("../../dbconnection");

//load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//@route POST api/users/register
//@desc  Register user
//@access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const selectQuery = "SELECT * from User where email = ?";
  connection.query(selectQuery, [req.body.email], (err, result) => {
    if (result.length > 0) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //Default
      });
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      };

      const insertQuery =
        "INSERT INTO User ( name,email,avatar,password,date) values (?,?,?,?,NOW())";
      connection.query(
        insertQuery,
        [newUser.name, newUser.email, newUser.avatar, newUser.password],
        (err, rows) => {
          newUser.Userid = rows.insertedId;
          res.json(newUser);
        }
      );
    }
  });
});

router.post("/test", (req, res) => {
  connection.query(
    "SELECT * FROM User where email = ?",
    [req.body.email],
    (err, rows) => {
      res.json(rows);
    }
  );
});

//@route GET api/users/login
//@desc  login User/Returning JWT
//@access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //Find User email
  const selectQuery = "SELECT * from User where email = ?";
  connection.query(selectQuery, [email], (err, result) => {
    //check user
    if (result.length === 0) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //Check password
    bcrypt.compare(password, result[0].password).then(isMatch => {
      if (isMatch) {
        //User Matched
        const payload = {
          Userid: result[0].Userid,
          name: result[0].name,
          avatar: result[0].avatar
        }; // Create JWT Payload
        //Sign token
        jwt.sign(
          payload,
          key.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            return res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//@route GET api/users/current
//@desc  Return current user
//@access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      Userid: req.user[0].Userid,
      name: req.user[0].name,
      email: req.user[0].email
    });
  }
);
module.exports = router;
