const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const users = require("./routes/api/users");
const accounts = require("./routes/api/accounts");
const biddingproducts = require("./routes/api/biddingproducts");

const app = express();
app.get("/", (req, res) => res.send("Hello"));

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

//Use Routes
app.use("/api/users", users);
app.use("/api/accounts", accounts);
app.use("/api/biddingproducts", biddingproducts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
