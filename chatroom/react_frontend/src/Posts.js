import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";

const Posts = (props) => {
  const { channelid, name } = useParams(); // set channel same and the titile name
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  // fetch posts when posts component is first rendered!
  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/${channelid}/getPosts`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const addPost = async (parentid, data) => {
    if (!props.user || !props.user.username) {
      console.error("User information is missing.");
      return;
    }

    const requestBody = new URLSearchParams({
      user: props.user.username,
      data: data,
      channel: channelid,
      parentid: parentid,
    });

    console.log("Request Body:", requestBody.toString());

    try {
      const response = await fetch(
        `http://localhost:8080/${channelid}/addPost`,
        {
          method: "POST",
          body: requestBody,
          headers: { "Content-type": "application/x-www-form-urlencoded" },
        }
      );

      if (response.status !== 200) {
        alert(`Error: could not add message to ${name}`);
        return;
      }

      await getPosts(); // refresh
    } catch (error) {
      console.error(error);
    }

    setNewPost("");
  };

  return (
    <div className="text-center mx-auto my-4" style={{ maxWidth: "50%" }}>
      <h1>{name}</h1>
      {/* place the input box and create-post button in the center */}
      <div className="d-flex justify-content-center align-items-center flex-column mt-2">
        <input
          id="InputBox"
          type="text"
          placeholder="Create a post"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button
          onClick={(e) => addPost(-1, newPost)}
          className="btn btn-outline-success mt-2"
        >
          Create Post
        </button>
      </div>
      {posts.map((data, index) => {
        return (
          <Comments
            key={index}
            data={data}
            user={props.user}
            addpost={addPost}
            getPosts={getPosts}
            replyDepth={1} // Assuming top-level comments have replyDepth 1
          />
        );
      })}
    </div>
  );
};

export default Posts;
