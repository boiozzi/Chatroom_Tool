import React, { useState } from 'react';
import axios from 'axios';

const PostForm = ({ onAddPosts }) => {
  const [topic, setTopic] = useState('');
  const [data, setData] = useState('');

  const addPosts = () => {
    axios.post('http://0.0.0.0:8080/addposts', { topic, data })
      .then(response => {
        console.log(response.data);
        // Notify the parent component that a new posts has been added
        onAddPosts();
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Add Posts</h2>
      <label>
        Topic:
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} />
      </label>
      <label>
        Data:
        <input type="text" value={data} onChange={e => setData(e.target.value)} />
      </label>
      <button onClick={addPosts}>Add Posts</button>
    </div>
  );
};

export default PostForm;