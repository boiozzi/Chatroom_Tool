import React, { useState } from "react";
import axios from "axios";

const Comment = (props) => {
  const [newComment, setNewComment] = useState("");
  const channel = props.data.channel;
  const postid = props.data.postid;

  // adding comments to a post(or to a reply)
  const addComment = async () => {
    props.addpost(props.data.postid, newComment);
  };

  const deletePost = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/${channel}/posts/removePost/${postid}`
      );
      if (response.status === 200) {
        props.getPosts(); // refresh
      } else {
        console.error("Error deleting post", response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`container mb-2 d-flex justify-content-between align-items-center`}
      style={{ backgroundColor: "#fff", padding: "8px", borderRadius: "4px" }}
    >
      <div>
        <div className="content">
          {/* display post */}
          <b>{props.data.user}:</b>
          <p>{props.data.data}</p>
        </div>
        {props.user.admin && (
          <button className="btn btn-danger" onClick={deletePost}>
            Delete
          </button>
        )}

        <div className="mt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={addComment} className="btn btn-success ml-2">
            Add Comment
          </button>
        </div>
        
        {/* Recursively render replies */}
        {props.data.replies && props.data.replies.length > 0 && (
          <div className="ml-4">
            {props.data.replies.map((reply, index) => (
              <Comment
                key={index}
                data={reply}
                user={props.user}
                addpost={props.addpost}
                getPosts={props.getPosts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
