import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchPosts, fetchCommunities, fetchComments, fetchLinkFlairs, fetchUsers } from './api';

export const PhredditContext = createContext();

export const PhredditProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [comments, setComments] = useState([]);
  const [linkflairs, setLinkFlairs] = useState([]);
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState('welcome');
  const [currentCommunityID, setCurrentCommunityID] = useState(null); 
  const [currentPostID, setCurrentPostID] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [user, setUser] = useState(null)

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedComment, setSelectedComment] = useState(null)

  // fetchData function that fetches all the data
  const fetchData = async () => {
    const [postsData, communitiesData, commentsData, linkFlairsData, usersData] = await Promise.all([
      fetchPosts(),
      fetchCommunities(),
      fetchComments(),
      fetchLinkFlairs(),
      fetchUsers()
    ]);
    setPosts(postsData);
    setCommunities(communitiesData);
    setComments(commentsData);
    setLinkFlairs(linkFlairsData);
    setUsers(usersData);
  };

  // Fetch data once when the provider mounts
  useEffect(() => {
    fetchData();
  }, []); // This effect runs only once on mount

  // Refetch data whenever currentPage changes
  useEffect(() => {
    fetchData();
  }, [currentPage]); // This effect runs when currentPage changes

  const loadPage = (page, communityID = null, postID = null, searchResults = null, searchString = null) => {
    setCurrentPage(page);
    
    if (communityID) setCurrentCommunityID(communityID)
    if (postID) setCurrentPostID(postID);
    if (searchString || searchResults) {
      setSearchString(searchString);
      setSearchResult(searchResults);
    }
  };

  return (
    <PhredditContext.Provider value={{
      posts, setPosts, communities, setCommunities, comments, setComments, linkflairs, setLinkFlairs, 
      currentPage, currentCommunityID, currentPostID, 
      searchResult, searchString, user, setUser, loadPage,
      selectedUser, setSelectedUser, selectedCommunity, setSelectedCommunity,
      selectedPost, setSelectedPost, setSelectedComment, selectedComment, users, setUsers
    }}>
      {children}
    </PhredditContext.Provider>
  );
};

// Custom hook to use the context
export const UsePhredditContext = () => {
    return useContext(PhredditContext);
  };