import '../stylesheets/index.css';
import React, { useState } from 'react';
import TopBanner from './topBanner.jsx';
import SideNavbar from './sideNavbar.jsx';
// pages felice added
import CreateCommunity from './NewCommunityPage/CreateCommunity.jsx';
import CreatePost from './NewPostPage/CreatePost.jsx';
// pages sim added
import CommunityPage from './CommunityPage.jsx'; 
import HomePage from './HomePage.jsx';
import PostPage from './PostPage.jsx';
import SearchResultsPage from './searchResultsPage.jsx';
import { UsePhredditContext } from './phredditContext.js';
import LoginPage from './login.jsx';
import SignUpPage from './CreateAccountPage.jsx';
import WelcomePage from './WelcomePage.jsx';
import UserProfile from './userProfilePage.jsx';

export default function Phreddit() {

  const {currentPage} = UsePhredditContext();

  // Conditional rendering based on currentPage
  const renderPage = () => {
    console.log(currentPage)
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage></WelcomePage>
      case 'login':
        return <LoginPage></LoginPage>
      case 'signup':
        return <SignUpPage></SignUpPage>
      case 'home':
        return <HomePage/>;
      case 'post':
        return <PostPage/>;
      case 'createPost':
        return <CreatePost />;
      case 'createCommunity':
        return <CreateCommunity/>;
      case 'community':
        return <CommunityPage/>;
      case 'searchResults':
        return <SearchResultsPage></SearchResultsPage>
      case 'userProfile':
        return <UserProfile></UserProfile>
      default:
        return <h2>Page not found!</h2>; // Fallback for unknown pages
    }
  };
  
  return (
    <div>
      {currentPage != "login" && currentPage != "signup" && currentPage != "welcome"? 
      <>
         <TopBanner/>
         <SideNavbar/>
         <div className="main-content">
           {renderPage()} 
         </div> </> : <>{renderPage()} </>
      }
    </div>
  );
}