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

//Creates a database called sheqqdb and 4 tables(userInfo, posts, channels, likes).
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
    parentid int NOT NULL,
    user varchar(280) NOT NULL,
    data varchar(280) NOT NULL,
    PRIMARY KEY (postid)
)`,
    (error, result) => {
      if (error) {
        console.error(error);
      }
    }
  );

  // create table for likes
  connection.query(
    `CREATE TABLE IF NOT EXISTS likes (
      likesid int unsigned NOT NULL auto_increment,
      user varchar(280) NOT NULL,
      channelid int unsigned NOT NULL,
      postid int unsigned NOT NULL,
      PRIMARY KEY (likesid)
  )`,
    (error, result) => {
      if (error) {
        console.error(error);
      }
    }
  );

  res.send("Database and Table created!");
});

// login into system
app.post("/login", (req, res) => {
  // Extracting username and password from the request body
  const { username, password } = req.body;

  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) console.log(error);
  });

  // check if the user exists and get user details along with admin status
  connection.query(
    `SELECT userid, username, CASE WHEN userid = 1 THEN 1 ELSE 0 END as admin FROM userInfo WHERE username = ? AND password = ?`,
    [username, password],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(400).send(error);
      } else if (results.length === 0) {
        // If no matching user found, return unauthorized status
        res.status(401).send();
      } else {
        // Extracting user details and admin status from the query results
        const user = {
          userid: results[0].userid,
          username: results[0].username,
          admin: results[0].admin === 1,
        };
        res.status(200).send(JSON.stringify(user));
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
  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) console.log(error);
  });
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
  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) console.log(error);
  });
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
        res.status(200).send("Channel deleted");
      }
    }
  );
});

// create a post in channel with id, in which channel, the person who posts it, and the post data.
app.post("/:channelid/addPost", (req, res) => {
  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) console.log(error);
  });
  let channel = req.params.channelid;
  let user = req.body.user;
  let data = req.body.data;
  let parentid = req.body.parentid;
  connection.query(
    `INSERT INTO posts
      (channel, parentid, user, data) VALUES 
      ('${channel}', '${parentid}', '${user}', '${data}')`,
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

// Get posts for a specific channel
app.get("/:channel/getPosts", (req, res) => {
  let channel = req.params.channel;
  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) console.log(error);
  });

  connection.query(
    `SELECT * FROM posts WHERE channel = '${channel}'`,
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(400).send(error);
      } else {
        const postsWithReplies = buildNestedStructure(result);
        res.status(200).json(postsWithReplies);
      }
    }
  );
});

// Helper function to build nested structure
function buildNestedStructure(posts) {
  const postMap = new Map();

  // First pass: Create a map of posts
  posts.forEach((post) => {
    const postId = post.postid;
    post.replies = []; // Initialize replies array
    postMap.set(postId, post);
  });

  // Second pass: Attach replies to their parent posts
  posts.forEach((post) => {
    const parentId = post.parentid;
    if (parentId !== null) {
      const parentPost = postMap.get(parentId);
      if (parentPost) {
        parentPost.replies.push(post);
      }
    }
  });

  // Filter out posts that are replies
  const topLevelPosts = posts.filter((post) => post.parentid === -1);
  console.log("Posts after second pass:", posts);
  console.log("Top-level posts:", topLevelPosts);

  return topLevelPosts;
}

//delete a post and all its replies.
app.delete("/:channelid/posts/removePost/:postid", (req, res) => {
  const channelID = req.params.channelid;
  const postID = req.params.postid;

  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) console.log(error);
  });
  connection.query(
    `DELETE FROM posts WHERE channel = ? AND postID = ?`,
    [channelID, postID],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Check if any rows were affected (post deleted successfully)
      if (result.affectedRows > 0) {
        res.status(200).send("Post deleted successfully");
      } else {
        // If no rows were affected, the post might not exist
        res.status(404).send("Post not found");
      }
    }
  );
});

// adding a post
app.post("/:channelid/posts/:postid/addComment", (req, res) => {
  const channelID = req.params.channelid;
  const postID = req.params.postid;
  const user = req.body.user;
  const data = req.body.data;

  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) console.log(error);
  });

  connection.query(
    `INSERT INTO comment (channelid, postid, user, data) VALUES (?, ?, ?, ?)`,
    [channelID, postID, user, data],
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

//get comments for a post
app.get("/:channelid/posts/:postid/getComments", (req, res) => {
  const channelID = req.params.channelid;
  const postID = req.params.postid;

  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.query(
      `SELECT * FROM comment WHERE channelid = ? AND postid = ?`,
      [channelID, postID],
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
          return;
        }

        res.status(200).json(result);
      }
    );
  });
});

// delete a comment
app.delete("/:channelid/posts/:postid/removeComment/:commentid", (req, res) => {
  const channelID = req.params.channelid;
  const postID = req.params.postid;
  const commentID = req.params.commentid;

  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.query(
      `DELETE FROM comment WHERE channelid = ? AND postid = ? AND commentid = ?`,
      [channelID, postID, commentID],
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
          return;
        }

        // Check if any rows were affected (comment deleted successfully)
        if (result.affectedRows > 0) {
          res.status(200).send("Comment deleted successfully");
        } else {
          // If no rows were affected, the comment might not exist
          res.status(404).send("Comment not found");
        }
      }
    );
  });
});

//get likes for a post
app.get("/:channelid/posts/:postid/getlikes", (req, res) => {
  const channelID = req.params.channelid;
  const postID = req.params.postid;
  const user = req.params.user;

  connection.query(`USE sheqqdb`, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
      return;
    }

    connection.query(
      `SELECT * FROM likes WHERE channelid = ? AND postid = ? AND user = ?`,
      [channelID, postID, user],
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.status(200).json(result);
      }
    );
  });
});

// Start the server
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
