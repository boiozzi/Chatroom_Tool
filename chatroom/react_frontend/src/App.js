import { React, useState, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

// import Landing from './Landing';
import Login from "./Login";
import Register from "./Register";
import Channel from "./Channel";
import InsideChannel from "./InsideChannel";
import LandingPage from "./LandingPage";

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    /* Check for saved authorization whenever the page loads */
    const storeValue = localStorage.getItem("user");
    if (storeValue !== null) {
      setUserInfo(JSON.parse(storeValue));
    }
  }, []);

  const onLogIn = (userid, username, admin) => {
    const userJSON = {
      userid: userid,
      username: username,
      admin: admin,
    };
    setUserInfo(userJSON);
    /* Save authorization in local storage */
    localStorage.setItem("user", JSON.stringify(userJSON));
  };

  const onLoggedOut = () => {
    setUserInfo(null);
    /* Remove saved authorization from local storage */
    localStorage.removeItem("user");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to="/" className="navbar-brand">
          Your App Name
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Log In
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login onLogIn={onLogIn} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            userInfo ? <Channel user={userInfo} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/channels/:channelid/:title"
          element={<InsideChannel user={userInfo} />}
        />
      </Routes>
    </div>
  );
}

export default App;
