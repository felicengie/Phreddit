import React from "react";
import SearchBar from "./searchBar";
import { UsePhredditContext } from "./phredditContext";

const TopBanner = () => {
    const { loadPage, currentPage, user, setUser, setSelectedUser, setSelectedPost} = UsePhredditContext() // Use useContext to access the values from context

    const handleLogout = () => {
        setUser(null)
        loadPage('welcome')
    }

    const navUserProfile = () => {
        setSelectedUser(user)
        loadPage('userProfile')
    }

    return (
        <header className="banner">
            <div className="banner-content">
                <div>
                    <a className="name-title" href="#" onClick={() => loadPage('home')}>
                        phreddit
                    </a>
                </div>

                {currentPage  != "login" && currentPage != "signup" && currentPage != "welcome" ?
                    <>
                    <SearchBar></SearchBar>
                    <div className = "banner-buttons">
                        <button
                            disabled = {!user}
                            className={`post-button ${currentPage === 'createPost' ? 'active' : ''}`}
                            onClick={() =>{
                                setSelectedPost(null)
                                loadPage('createPost')
                            } 
                                
                            }
                        >
                            Create Post
                        </button>
                   

                    {user ? (
                        <>
                        <button className="profile-button" onClick={navUserProfile}>
                            {user.displayName}
                        </button>

                        <button className="logout-button" onClick={handleLogout}>
                        Logout
                        </button> </>
                        ): 
                        <button className="profile-button"> Guest </button>}
                         </div>
                    </> : <></>
                }
                
            </div>
        </header>
    );
}

export default TopBanner;