import React, {useState, useEffect} from 'react';
import { displayPosts, sortPosts } from './functions'; // Import your displayPosts function
import { UsePhredditContext } from './phredditContext';


const SearchResultsPage = () => {
   const {searchResult, searchString, comments} = UsePhredditContext()
   //console.log("Search string:", searchString)
   //console.log("Search Page results:", searchResult)
  // Function to handle sorting
 
  const [posts, setPosts] = useState([]);
  // Handle sorting and update posts
  const handleSort = (type) => {
    const sortedPosts = sortPosts(posts, type, comments);
    setPosts(sortedPosts);
  };

  useEffect(() => {
    setPosts(sortPosts(searchResult, 'newest'));
  }, [searchResult]);


  // Render the search results
  return (
    <div>
      {searchResult.length > 0 ? (
        <>
        <header className="searchPage-header">
            <div className="header">Results For: "{searchString}"</div>
            <div className="viewPost-buttons">
            <button className="viewPost-button" onClick={() => handleSort('newest')}>Newest</button>
            <button className="viewPost-button" onClick={() => handleSort('oldest')}>Oldest</button>
            <button className="viewPost-button" onClick={() => handleSort('active')}>Active</button>
            </div>
        </header>
        <div>{searchResult.length} post(s) </div>
          <div>
             {displayPosts({posts: posts, showCommunityName:true})} 
          </div>

        </>
      ) : (
        <div>
          <div className="header-text">No Results For: "{searchString}"</div>
          <p>0 posts</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;