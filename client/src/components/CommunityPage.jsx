import React, { useState, useEffect } from 'react';
import { displayPosts, sortPosts, getTimeDifference } from './functions'; // Adjust import path for functions
import { UsePhredditContext } from './phredditContext';
import { updateCommunity } from './api';

const CommunityPage = () => {
    const {communities, setCommunities, loadPage, posts, currentCommunityID, user} = UsePhredditContext()
    const [community, setCommunity] = useState(null);
    const [communityPosts, setCommunityPosts] = useState([]);

  useEffect(() => {
    const communityData = communities.find(c => c._id === currentCommunityID);
    if (communityData) {
      setCommunity(communityData);
      const communityPosts = posts.filter(post => communityData.postIDs.includes(post._id));
      setCommunityPosts(communityPosts);
    }
  }, [currentCommunityID]);

  
  const handleSortChange = (order) => {
    const sortedPosts = sortPosts(communityPosts, order); // Use your sorting function
    setCommunityPosts(sortedPosts);
  };


  const handleJoinToggle = async () => {
    const isMember = community.members.includes(user.displayName);
    const updatedMembers = isMember
      ? community.members.filter((displayName) => displayName !== user.displayName) // Remove user
      : [...community.members, user.displayName]; // Add user

    const updatedCommunityData = {
      ...community,
      members: updatedMembers,
    };

    try {
      const updatedCommunity = await updateCommunity(currentCommunityID, updatedCommunityData);
      setCommunity(updatedCommunity); // Update the state with the new community data

      // Update the global communities state in the context
      setCommunities((prevCommunities) =>
        prevCommunities.map((c) =>
          c._id === currentCommunityID ? updatedCommunity : c
        )
      );
    } catch (error) {
      console.error('Error updating community membership:', error);
    }
  };

  if (!community) return <div>Loading community...</div>;

  const isMember = community.members.includes(user?.displayName);

  return (
    <div className="communityPage">
      <header className="communityPage-header">
        <div className="header-text">{community.name}</div>
       
        <div className="viewPost-buttons">
          {user && <button className = "logout-button" onClick={handleJoinToggle}>{isMember ? 'Leave' : 'Join'}</button>}
          <button className="viewPost-button" onClick={() => handleSortChange('newest')}>Newest</button>
          <button className="viewPost-button" onClick={() => handleSortChange('oldest')}>Oldest</button>
          <button className="viewPost-button" onClick={() => handleSortChange('active')}>Active</button>
        </div>
      </header>
      <div>Created By: {community.createdBy} | {`${getTimeDifference(community.startDate.toLocaleString())}`}</div>
      <div className="community-description">{community.description}</div>
      <div className="timestamp">
        
      </div>

      <div>{communityPosts.length} post(s) Members: {community.members.length}</div>

      
      <div id="community-post-list" style={{ overflowY: 'scroll' }}>
        {displayPosts({ posts: communityPosts,showCommunityName: false})}
      </div>
    </div>
  );
};

export default CommunityPage;