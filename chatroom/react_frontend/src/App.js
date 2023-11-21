import PostForm from "./AddPost";
import PostList from "./ShowPost";
import LandingPage from "./LandingPage";
import { Route, Routes, Link } from "react-router-dom";

const App = () => {
  return (
    <center>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/add" element={<PostForm />} />
          <Route path="/show" element={<PostList />} />
        </Routes>
      </div>

      <div>
        <nav>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link to="/">HomePage</Link>
            </li>
            <li>
              <Link to="/add">Add Post</Link>
            </li>
            <li>
              <Link to="/show">Show Posts</Link>
            </li>
          </ul>
        </nav>
      </div>
    </center>
  );
};

export default App;
