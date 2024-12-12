import React, { useState, useEffect } from 'react';
import { displayPosts, sortPosts } from './functions'; // Adjust the path as necessary
import { UsePhredditContext } from "./phredditContext";


export default function HomePage() {
  const {posts, comments} = UsePhredditContext() // Use useContext to access the values from context 
  //const [loading, setLoading] = useState(true); // For handling loading state
  const[sortedPosts, setSortedPosts] = useState([])

  useEffect(() => {
    setSortedPosts(posts)
  }, [posts]);
  
  // Handle sorting and update posts
  const handleSort = (type) => {
    const sorted = sortPosts(posts, type, comments); // Sort posts based on the selected type
    setSortedPosts(sorted);
  };



  return (
    <div className="homepage-container">
      
      <header className="homePage-header">
        <div className="header-text">All Posts</div>
        <div className="viewPost-buttons">
          <button className="viewPost-button" onClick={() => handleSort('newest')}>Newest</button>
          <button className="viewPost-button" onClick={() => handleSort('oldest')}>Oldest</button>
          <button className="viewPost-button" onClick={() => handleSort('active')}>Active</button>
        </div>
      </header>

      <div>{posts.length} post(s)</div>

      <div id="post-list" style={{ overflowY: 'scroll' }}>
        {displayPosts({ showCommunityName:true, posts: sortedPosts})}
      </div>
    </div>
  );
}
