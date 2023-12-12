import { React, useState, useEffect } from "react";
import axios from "axios";

const Users = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users when the component mounts
    getUsers();
  }, []);

  const deleteUser = async (userid) => {
    try {
      const response = await fetch(
        `http://localhost:8080/deleteuser/${userid}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        console.error(`Error: Could not remove user (${response.status})`);
        alert("Error: could not remove user");
        throw new Error(`Error: trouble deleting user (${response.status})`);
      }

      console.log("User successfully removed from the system");

      // Update state immediately after deletion
      setUsers((prevUsers) => {
        const newUsers = prevUsers.filter((user) => user.userid !== userid);
        console.log("Updated users:", newUsers);
        return newUsers;
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users");
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div>
      <h1 className="text-center mb-4">User List</h1>
      {users.map((user) => (
        <div className="card mb-3" key={user.userid}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <b>{user.username}</b>
              </div>
              {props.user.admin && // ensure that only admin can delete users.
                user.userid !== 1 && ( // Ensure the admin cannot delete itself
                  <button
                    className="btn btn-danger"
                    onClick={(e) => deleteUser(user.userid)}
                  >
                    Delete
                  </button>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Users;
