const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "nodemysql"
});
connection.connect(err => {
  if (err) throw err;
  console.log("MYSQL connected...");
});

module.exports = connection;
