import React, {useState} from 'react';
import PropTypes from 'prop-types';
import '../stylesheets/index.css';
import { UsePhredditContext } from './phredditContext';

const SideNavbar = () => {
    //const [currentCommunity, setCurrentCommunity] = useState('')

    const {communities, loadPage, currentCommunityID, currentPage, user, setSelectedCommunity} = UsePhredditContext()
    console.log(communities)

    let sortedCommunities = communities
   
    if (user){
        sortedCommunities = [...communities].sort((a, b) => {
            const isAMember = a.members.includes(user.displayName);
            const isBMember = b.members.includes(user.displayName);
            return isBMember - isAMember; // Members first
          });
    }
   
    return (
        <div className="navbar">
            {/* Home button */}
            <a 
            onClick={() => loadPage('home')}
            className={`navbar-link ${currentPage === 'home' ? 'active' : 'inactive'}`}
            >Home</a>

            {/* Header for communities */}
            <header className="navbar-header">COMMUNITIES</header>

            {/* Create Community button */}
            <a 
            onClick={(e) => {
                if (!user) {
                  e.preventDefault();  // Prevent the default action (navigation)
                } else {
                  loadPage('createCommunity');  // Proceed with the navigation if the user is logged in
                }
              }}
              className={`navbar-link ${!user ? 'disabled' : ''} ${currentPage === 'createCommunity' ? 'active' : ''}`}
            >Create Community</a>
            
            {/* Render community links */}
            <div className="community-links-container">
                {sortedCommunities.map(community => (
                <a
                    key={community._id}
                    href="#"
                    className={`community-link ${currentCommunityID === community._id && currentPage === "community" ? 'active' : ''}`}
                    onClick={() => {
                        setSelectedCommunity(null)
                        loadPage('community', community._id)}
                    }
                >
                    {community.name}
                </a>
                ))}
            </div>
        </div>
    );
};


export default SideNavbar;