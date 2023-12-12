import React, { useState, useEffect } from "react";
import axios from "axios";

const Comment = (props) => {
  const [newComment, setNewComment] = useState("");
  const [likesInfo, setLikesInfo] = useState({
    totalLikes: props.data.likes || 0,
    userLiked: props.data.userLiked || false,
  });
  const [DislikesInfo, setDisLikesInfo] = useState({
    totaDislLikes: props.data.dislikes || 0,
    userDisliked: props.data.usedisLiked || false,
  });

  const canAddPicture = props.user.username === props.data.user;
  const [selectedImage, setSelectedImage] = useState(null);
  const channel = props.data.channel;
  const postid = props.data.postid;

  useEffect(() => {
    // update the total number of likes
    const getLikesInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/${props.data.channel}/posts/${props.data.postid}/gettotallikes`
        );

        setLikesInfo({
          totalLikes: response.data.totalLikes,
          userLiked: response.data.userLiked,
        });
      } catch (error) {
        console.error("Error fetching likes info:", error);
      }
    };

    // update the total number of dislikes
    const getDislikesInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/${props.data.channel}/posts/${props.data.postid}/gettotalDislikes`
        );

        setDisLikesInfo({
          totaDislLikes: response.data.totalDislikes,
          userDisliked: response.data.userDisliked,
        });
      } catch (error) {
        console.error("Error fetching likes info:", error);
      }
    };

    getLikesInfo();
    getDislikesInfo();

    const storedImage = localStorage.getItem(`selectedImage_${postid}`);
    if (storedImage) {
      // Decode base64 image and set it as selectedImage
      setSelectedImage(dataURItoFile(storedImage, `screenshot_${postid}.png`));
    }
  }, [props.data.channel, props.data.postid, postid]);

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

  // Function to add a like to a post or reply
  const toggleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/${props.data.channel}/posts/${props.data.postid}/addlike`,
        { user: props.user.username }
      );
      console.log("Server response:", response.data);

      if (response.status === 200) {
        setLikesInfo({
          totalLikes: likesInfo.userLiked
            ? likesInfo.totalLikes - 1
            : likesInfo.totalLikes + 1,
          userLiked: !likesInfo.userLiked,
        });
      } else {
        console.error("Failed to toggle like:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // add dislike to post or reply
  const ToggleDislike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/${channel}/posts/${postid}/toggledislike`,
        { user: props.user.username }
      );

      if (response.status === 200) {
        setDisLikesInfo({
          totaDislLikes: DislikesInfo.userDisliked
            ? DislikesInfo.totaDislLikes - 1
            : DislikesInfo.totaDislLikes + 1,
          userDisliked: !DislikesInfo.userDisliked,
        });
      } else {
        console.error("Error toggling dislike", response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;

      // Save base64 encoded image to local storage
      localStorage.setItem(`selectedImage_${postid}`, base64Image);
      setSelectedImage(file);
    };

    reader.readAsDataURL(file);
  };

  const dataURItoFile = (dataURI, filename) => {
    try {
      const byteString = atob(dataURI.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new File([ab], filename, { type: "image/png" });
    } catch (error) {
      console.error("Error decoding base64 string:", error);
      return null;
    }
  };

  return (
    <div
      className={`card mb-2`}
      style={{
        borderRadius: "8px",
        marginLeft: `${props.replyDepth * 20}px`, // Adjust the multiplier as needed
      }}
    >
      <div className="card-body">
        {/* Display post information */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <b>{props.data.user}:</b>
            <p>{props.data.data}</p>
          </div>
          {props.user.admin && (
            <button className="btn btn-danger" onClick={deletePost}>
              Delete
            </button>
          )}
        </div>

        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Screenshot"
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
        )}

        {/* Timestamp at the bottom */}
        <p className="text-muted mt-2">
          {new Date(props.data.time).toLocaleString()}
        </p>

        {/* Input for adding comments */}
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

        {/* Button to trigger file input */}
        {canAddPicture && (
          <label className="btn btn-primary ml-2">
            Add Screenshot
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </label>
        )}

        <div className="mt-2">
          <button
            onClick={toggleLike}
            className={`btn ${
              likesInfo.userLiked ? "btn-success" : "btn-danger"
            } mr-2`}
          >
            {likesInfo.userLiked ? "Unlike" : "Like"} ({likesInfo.totalLikes})
          </button>

          <button
            onClick={ToggleDislike}
            className={`btn ${
              DislikesInfo.userDisliked ? "btn-success" : "btn-danger"
            } mr-2`}
          >
            {DislikesInfo.userDisliked ? "UnDislike" : "Dislike"} (
            {DislikesInfo.totaDislLikes})
          </button>
        </div>

        {/* Recursively render replies within the same card */}
        {props.data.replies &&
          props.data.replies.length > 0 &&
          props.data.replies.map((reply, index) => (
            <Comment
              key={index}
              data={reply}
              user={props.user}
              addpost={props.addpost}
              getPosts={props.getPosts}
              replyDepth={props.replyDepth + 1} // Increment the level for replies
            />
          ))}
      </div>
    </div>
  );
};
export default Comment;
