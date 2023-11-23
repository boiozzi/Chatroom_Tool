import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// import Post from "./Post";

const InsideChannel = (props) => {
  const { channelid, title } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    getpost();
    /* Getting an eslint warning for missing dependency, despite the same logic occuring in the Channels component >:( */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getpost = () => {
    fetch(`http://localhost:8080/${channelid}/getPosts`, { method: "GET" })
      .then((response) => {
        if (response.status !== 200) {
          console.error("Error: trouble retrieving Posts");
        }
        return response.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => console.error(error));
  };

  const addPost = (postid, posts) => {
    let data = posts;
    // error handling
    if (data.includes(`'`)) {
      data = data.replaceAll(`'`, ``);
    }
    fetch(`http://localhost:8080/${channelid}/addPosts`, {
      method: "POST",
      body: new URLSearchParams({
        user: props.user.username,
        data: data,
      }),
      headers: { "Content-type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        if (response.status !== 200) {
          alert(`Error: could not add message to ${title}`);
          throw new Error("Error: trouble adding new message");
        }
        getpost();
      })
      .catch((error) => console.error(error));
    setNewPost("");
  };

  return (
    <>
      <h1>{title}</h1>
      <button onClick={getpost}>Refresh</button>
      <div>
        <input
          id="addPostInput"
          type="text"
          placeholder="Create a posting"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={(e) => addPost(-1, newPost)} id="addPostButton">
          Create Post
        </button>
      </div>
      {posts.map((message, index) => {
        let keyValue = `posting-${index}`;
        return (
          <posts
            data={message}
            user={props.user}
            onPost={addPost}
            onRefresh={getpost}
            messageKey={keyValue}
            level={1}
            key={keyValue}
          />
        );
      })}
    </>
  );
};

export default InsideChannel;
