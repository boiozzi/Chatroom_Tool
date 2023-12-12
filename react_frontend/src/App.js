import { React, useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

// import Landing from './Landing';
import Login from "./Login";
import Register from "./Register";
import Channel from "./Channel";
import CreatePosts from "./Posts";
import Navbar from "./Navbar";
import Search from "./Search";
import LandingPage from "./LandingPage";
import Users from "./Users";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    /* Check for saved authorization whenever the page loads */
    const storeValue = localStorage.getItem("user");
    if (storeValue !== null) {
      const userJSON = JSON.parse(storeValue);
      setUserInfo(userJSON);
    }
  }, []);

  const LOGin = (userid, username, admin) => {
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
    navigate("/login");
  };

  return (
    <>
      <Navbar user={userInfo} onLoggedOut={onLoggedOut} />

      <Routes>
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/login" element={<Login LOGin={LOGin} />} />
        <Route path="/register" element={<Register LOGin={LOGin} />} />
        <Route
          path="/search"
          element={
            userInfo ? <Search user={userInfo} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/users"
          element={
            userInfo ? <Users user={userInfo} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/"
          element={
            userInfo ? (
              <Channel user={userInfo} />
            ) : (
              <Navigate to="/landingpage" />
            )
          }
        />
        <Route
          path="/channels/:channelid/:name"
          element={
            userInfo ? (
              <CreatePosts user={userInfo} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
