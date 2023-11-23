import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Channel = ({ user }) => {
//   const [error, setError] = useState(false);
  const [channels, setChannels] = useState([]);
  const [newChannel, setNewChannel] = useState("");

  useEffect(() => {
    getchannels();
  }, []);

  const getchannels = async () => {
    try {
      const response = await fetch("http://localhost:8080/getChannel");

      const data = await response.json();
      setChannels(data);
    } catch (error) {
      console.error("Error getting channels", error);
    }
  };

  const createChannel = async () => {
    // Base case where the input name is empty.
    if (newChannel === "") {
      return;
    }

    try {
      // Sending a POST request to the server to create a new channel using Axios.
      const response = await axios.post(
        "http://localhost:8080/createChannel",
        new URLSearchParams({ name: newChannel }),
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Checking if the server response is successful (status code 200-299).
      if (response.status !== 200) {
        // Displaying an error alert if creating a new channel fails.
        alert("Error: could not create new channel");

        // Throwing an error to indicate trouble creating a new channel.
        throw new Error("Error: trouble creating new channel");
      }

      // If creating the new channel is successful, fetching the updated list of channels.
      getchannels();

      // Clearing the input field for the new channel name.
      setNewChannel("");
    } catch (error) {
      // Handling and logging any errors that occur during the process.
      console.error(error);
    }
  };

  const deleteChannel = async (channelid, name) => {
    // Ask the user for confirmation
    const userConfirmed = window.confirm(`Deleting the channel: ${name}?`);

    // If the user didn't confirm, exit the function
    if (!userConfirmed) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/deleteChannel/${channelid}`);
      alert(`Channel ${name} deleted:)`);
      getchannels();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // <div>
    //   <nav
    //     className="navbar navbar-light bg-dark"
    // >
    //     <Link to="/search" className="navbar-brand mx-5" style={{ color: "#ffffff", textShadow: "1px 1px 1px #000000" }}>
    //       Search Channel
    //     </Link>
    //   </nav>
      <div
        className="container mt-4 p-4"
        style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
      >
        <h1 className="mb-3">Hello, {user.username}!</h1>
        <h2 className="mb-3">Welcome to SHEqq</h2>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <input
            type="text"
            id="createChannel"
            className="form-control mr-2"
            placeholder="New channel name"
            value={newChannel}
            onChange={(e) => setNewChannel(e.target.value)}
          />
          <button className="btn btn-success" onClick={createChannel}>
            Create Channel
          </button>
        </div>
        {channels.map((channel) => (
          <div
            key={channel.channelid}
            className="container mb-2 d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: "#fff",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            <Link
              to={`/channels/${channel.channelid}/${channel.name}`}
              key={channel.channelid}
              className="btn btn-primary mr-2"
            >
              {channel.name}
            </Link>
            {user.admin && (
              <button
                className="btn btn-danger"
                onClick={() => deleteChannel(channel.channelid, channel.name)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <div className="d-flex mt-3">
          <Link to="/users" className="btn btn-secondary mr-2">
            Users
          </Link>
        </div>
      </div>
    // </div>
  );
};

export default Channel;
