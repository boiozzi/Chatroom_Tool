import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="text-center">
      <h1>Welcome to Sheqq (Channel-Based Tool)</h1>
      <p>This chat application allows you to:</p>
      <ul>
        <li>Create channels to organize discussions.</li>
        <li>Post questions in different channels.</li>
        <li>Reply to posts and engage in threaded discussions.</li>
        <li>Like or dislike posts to express your opinion.</li>
        <li>Search for specific posts or users.</li>
      </ul>
      <p className="mt-4">
        <strong>Login or Sign up to get started!</strong>
      </p>
      <Link to="/login" className="btn btn-primary mt-2">
        Login
      </Link>
    </div>
  );
};

export default LandingPage;
