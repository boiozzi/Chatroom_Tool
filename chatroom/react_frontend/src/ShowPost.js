import React, { useState, useEffect } from "react";
import axios from "axios";

const PostList = () => {
  const [posts, setPost] = useState([]);

  useEffect(() => {
    axios
      .get("http://0.0.0.0:8080/getposts")
      .then((response) => setPost(response.data.posts))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Post List</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id}>
            {" "}
            {post.id} - {post.topic} - {post.data}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
