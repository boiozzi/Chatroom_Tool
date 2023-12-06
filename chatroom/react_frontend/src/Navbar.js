import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLoggedOut }) => {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light">
      <div className="container-fluid">
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto ms-5">
            {user ? (
              //render links for logged-in user
              <>
                {/* view channel */}
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    Channels
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link mx-auto" to="/search">
                    Search
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Users
                  </Link>
                </li>
              </>
            ) : (
              // Render links for not logged-in user
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          {user && (
            // move the log out button the right side of the nav bar
            <button
              type="button"
              className="btn btn-outline-success ms-auto"
              onClick={onLoggedOut}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
