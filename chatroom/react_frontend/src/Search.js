import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [mostPosts, setMostPosts] = useState([]);
  const [leastPosts, setLeastPosts] = useState([]);
  // add this to conditionally render the showing user with most/least posts
  const [showMostPosts, setShowMostPosts] = useState(false);
  const [showLeastPosts, setShowLeastPosts] = useState(false);
  const [mostLikes, setMostLikes] = useState([]);
  const [leastLikes, setLeastLikes] = useState([]);
  const [showMostLikes, setShowMostLikes] = useState(false);
  const [showLeastLikes, setShowLeastLikes] = useState(false);

  // search for post by contents
  const searchContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/search/content?q=${searchQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching content:", error);
    }
  };

  // search for posts by username
  const searchByUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/search/user-content?username=${userSearchQuery}`
      );
      setUserSearchResults(response.data);
    } catch (error) {
      console.error("Error searching by user:", error);
    }
  };

  // Get users with most posts
  const getUsersWithMostPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/users/most-posts"
      );
      console.log(response.data);
      setMostPosts(response.data[0]);
      setShowMostPosts(true);
    } catch (error) {
      console.error("Error fetching users with most posts:", error);
    }
  };

  // Get users with least posts
  const getUsersWithLeastPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/users/least-posts"
      );
      setLeastPosts(response.data[0]);
      setShowLeastPosts(true);
    } catch (error) {
      console.error("Error fetching users with least posts:", error);
    }
  };

  // get user with most likes
  const getUsersWithHighestLikes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/users/highest-likes"
      );
      console.log(response.data[0]);
      setMostLikes(response.data[0]);
      setShowMostLikes(true);
      // Update state or UI to display the users with the highest like count
    } catch (error) {
      console.error("Error fetching users with highest likes:", error);
    }
  };

  // get user with the least likes
  const getUsersWithLeastLikes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/users/lowest-likes"
      );
      console.log(response.data[0]);
      setLeastLikes(response.data[0]);
      setShowLeastLikes(true);
      // Update state or UI to display the users with the highest like count
    } catch (error) {
      console.error("Error fetching users with lowest likes:", error);
    }
  };

  const clearSearch = () => {
    setMostPosts("");
    setLeastPosts("");
    setMostLikes("");
    setLeastLikes("");
    setShowMostPosts(false);
    setShowLeastPosts(false);
    setShowMostLikes(false);
    setShowLeastLikes(false);
  };

  return (
    <div className="container mt-4">
      {/* Buttons at the top */}
      {/* show user with most post */}
      <div className="d-flex justify-content-between mb-4">
        <div>
          <button className="btn btn-primary" onClick={getUsersWithMostPosts}>
            Users with Most Posts
          </button>

          {showMostPosts && (
            <div>
              <h2>Users with Most Posts</h2>
              {mostPosts ? (
                <p>
                  {mostPosts.user} - {mostPosts.postCount} posts
                </p>
              ) : (
                <p>No user found with most posts</p>
              )}
            </div>
          )}
        </div>
          
          {/* show user with least post */}
        <div>
          <button className="btn btn-primary" onClick={getUsersWithLeastPosts}>
            Users with Least Posts
          </button>
          {showLeastPosts && (
            <div>
              <h2>Users with Least Posts</h2>
              {leastPosts ? (
                <p>
                  {leastPosts.user} - {leastPosts.postCount} posts
                </p>
              ) : (
                <p>No user found with least posts</p>
              )}
            </div>
          )}
        </div>
          {/* show user with most likes */}
        <div>
          <button
            className="btn btn-primary"
            onClick={getUsersWithHighestLikes}
          >
            Users with Highest Likes
          </button>
          {showMostLikes && (
            <div>
              <h2>Users with Highest Likes</h2>
              {mostLikes ? (
                <p>
                  {mostLikes.user} - {mostLikes.likeCount} likes
                </p>
              ) : (
                <p>No user found with highest likes</p>
              )}
            </div>
          )}
        </div>

          {/* show user with least likes */}
        <div>
          <button className="btn btn-primary" onClick={getUsersWithLeastLikes}>
            Users with Least Likes
          </button>
          {showLeastLikes && (
            <div>
              <h2>Users with Least Likes</h2>
              {leastLikes ? (
                <p>
                  {leastLikes.user} - {leastLikes.likeCount} likes
                </p>
              ) : (
                <p>No user found with least likes</p>
              )}
            </div>
          )}
        </div>

        <div>
          <button className="btn btn-secondary" onClick={clearSearch}>
            Clear
          </button>
        </div>
      </div>

      {/* search boxes(by content or by username) */}
      <div className="container mt-4">
        {/* search posts by content */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={searchContent}
            >
              Search
            </button>
          </div>
        </div>

        {/* display content search results */}
        <div>
          {searchResults.map((result) => (
            <div key={result.postid} className="card mb-3">
              <div
                className="card-body"
                style={{ backgroundColor: "lightblue" }}
              >
                <h5 className="card-title">User: {result.user}</h5>
              </div>
              <div className="card-body">
                <h5 className="card-title">Post Content: {result.data}</h5>
              </div>
            </div>
          ))}
        </div>

        {/* search post by username */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by user..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={searchByUser}
            >
              Search
            </button>
          </div>
        </div>

        {/* display user search results */}
        <div>
          {userSearchResults.map((result) => (
            <div key={result.postid} className="card mb-3">
              <div
                className="card-body"
                style={{ backgroundColor: "lightblue" }}
              >
                <h5 className="card-title">User: {result.user}</h5>
              </div>
              <div className="card-body">
                <h5 className="card-title">Post Content: {result.data}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
