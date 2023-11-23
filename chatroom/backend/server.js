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

// system admin username and password
const ADMIN_USERNAME = "user";
const ADMIN_PASSWORD = "admin";

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});

//Creates a database called sheqqdb and 4 tables(userInfo, messages, ratings, channels).
app.get("/init", (req, res) => {
  connection.query(`CREATE DATABASE IF NOT EXISTS sheqqdb`, (error, result) => {
    if (error) {
      console.error(error);
    }
  });

  /* Set the current database to "sheqqdb" */
  connection.query(`USE sheqqdb`, (error, result) => {
    if (error) {
      console.error(error);
    }
  });

  /* Create "userInfo" table if it doesn't already exist */
  connection.query(
    `CREATE TABLE IF NOT EXISTS userInfo (
    userid int unsigned NOT NULL auto_increment,
    username varchar(20) NOT NULL,
    password varchar(20) NOT NULL,
    PRIMARY KEY (userid),
    UNIQUE (username, password)
)`,
    (error, result) => {
      if (error) {
        console.error(error);
      } else {
        connection.query(`SELECT * FROM userInfo`, (error, result) => {
          if (error) {
            console.error(error);
          } else {
            // add admin information into the user table first.
            if (result.length === 0) {
              console.log("Creating system administrator!");
              connection.query(
                `INSERT INTO userInfo (username, password) VALUES ("${ADMIN_USERNAME}", "${ADMIN_PASSWORD}")`,
                (error, result) => {
                  if (error) {
                    console.error(error);
                  }
                }
              );
            }
          }
        });
      }
    }
  );

  // create table for channels
  connection.query(
    `CREATE TABLE IF NOT EXISTS channels (
    channelid int unsigned NOT NULL auto_increment,
    name varchar(200) NOT NULL,
    PRIMARY KEY (channelid)
)`,
    (error, result) => {
      if (error) {
        console.error(error);
      }
    }
  );

  // create table for posts
  connection.query(
    `CREATE TABLE IF NOT EXISTS posts (
    postid int unsigned NOT NULL auto_increment,
    channel int unsigned NOT NULL,
    user int unsigned NOT NULL,
    data varchar(280) NOT NULL,
    PRIMARY KEY (postid)
)`,
    (error, result) => {
      if (error) {
        console.error(error);
      }
    }
  );

  // create table for ratings
  connection.query(`CREATE TABLE IF NOT EXISTS ratings (
    ratingid int unsigned NOT NULL auto_increment,
    channelid int unsigned NOT NULL,
    postid int unsigned NOT NULL,
    raterid int unsigned NOT NULL,
    rating int unsigned NOT NULL,
    PRIMARY KEY (ratingid)
)`);
  res.send("Database and Table created!");
});

// login into system
app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) console.log(error);
  });

  connection.query(
    `SELECT * FROM userInfo WHERE username = "${username}" AND password = "${password}"`,
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(400).send(error);
      } else if (result.length === 0) {
        res.status(401).send();
      } else {
        res.status(200).send(
          JSON.stringify({
            userid: result[0].userid,
            username: result[0].username,
            admin: result[0].userid === 1,
          })
        );
      }
    }
  );
});

// sheqqdb registration.
app.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) console.log(error);
  });

  connection.query(
    `INSERT INTO userInfo (username, password) VALUES ('${username}', '${password}')`,
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(400).send(error);
      }
      res.status(201).send({
        message: "Account created successfully!",
      });
    }
  );
});

// create channal
app.post("/createChannel", (req, res) => {
  let name = req.body.name;
  connection.query(
    `INSERT INTO channels (name) VALUES ('${name}')`,
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send("New channel created!");
      }
    }
  );
});

// retrive channel from database
app.get("/getChannel", (req, res) => {
  connection.query("SELECT * FROM channels", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error fetching channels");
    } else {
      res.json(results);
    }
  });
});

// delete a channel in database
app.delete("/deleteChannel/:channelid", (req, res) => {
  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) console.log(error);
  });
  const channelid = req.params.channelid;
  connection.query(
    `DELETE FROM channels WHERE channelid = ?`,
    [channelid],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error deleting channel");
      } else {
        console.log(`Channel with ID ${channelid} deleted successfully`);
        res.status(200).send("Channel deleted successfully");
      }
    }
  );
});

// create a post in channel with id, in which channel, the person who posts it, and the post data.
app.post("/:channelid/addPost", (req, res) => {
  let channel = req.params.channelid;
  let user = req.body.username;
  let data = req.body.data;
  connection.query(
    `INSERT INTO posts
      (channelid, userid, parentid, text) VALUES 
      ('${channel}', '${user}', '${data}')`,
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(400).send(error);
      } else {
        res.status(200).send();
      }
    }
  );
});

// get posts from a channel.
// Get posts for a specific channel
app.get("/:channel/getPosts", (req, res) => {
  let channel = req.params.channel;

  connection.query(
    `SELECT * FROM posts WHERE channel = '${channel}'`,
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(400).send(error);
      } else {
        res.status(200).json(result);
      }
    }
  );
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
