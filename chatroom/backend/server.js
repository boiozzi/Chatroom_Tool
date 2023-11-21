// load package
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 8080;
const HOST = "0.0.0.0";
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Database Connection
const connection = mysql.createConnection({
  // host: '0.0.0.0'/localhost: Used to  locally run app
  host: "mysql1",
  user: "root",
  password: "admin",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});

//Creates a database called postdb and a table called posts.
// The posts has 3 columns: id, topic, and data.
// The id column is the primary key and is auto-incremented.
// The topic and data columns are both varchar(100) and cannot be null.
app.get("/init", (req, res) => {
  connection.query(
    `CREATE DATABASE IF NOT EXISTS postdb`,
    function (error, result) {
      if (error) console.log(error);
    }
  );
  //Create Table
  connection.query(`USE postdb`, function (error, results) {
    if (error) console.log(error);
  });
  connection.query(
    `CREATE TABLE IF NOT EXISTS posts 
    ( id int unsigned NOT NULL auto_increment, 
    topic varchar(100)NOT NULL,
    data varchar(100) NOT NULL,
    PRIMARY KEY (id))`,
    function (error, result) {
      if (error) console.log(error);
    }
  );
  res.send("Database and Table created!");
});

//Insert into Table
// Adds a new post to the database.
app.post("/addposts", (req, res) => {
  var topic = req.body.topic;
  var data = req.body.data;
  var query = `INSERT INTO posts (topic, data) VALUES ("${topic}", "${data}")`;
  connection.query(query, function (error, result) {
    if (error) console.log(error);
    res.send("New post inserted");
  });
});

//Get all posts
//A GET request that returns all the posts in the postdb.
app.get("/getposts", (req, res) => {
  connection.query(`USE postdb`, function (error, results) {
    if (error) console.log(error);
  });
  const sqlQuery = "SELECT * FROM posts";
  connection.query(sqlQuery, function (error, result) {
    if (error) console.log(error);
    res.json({ posts: result });
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
