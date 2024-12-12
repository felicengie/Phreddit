// SearchBar.js
import React, { useState } from 'react';
import { UsePhredditContext } from './phredditContext';
import '../stylesheets/index.css';

const SearchBar = () => {
    const {comments,posts, loadPage} = UsePhredditContext()
    const [searchString, setSearchString] = useState('');

     // Recursive function to search comments
     const searchComments = (commentID, searchTerms) => {
        const comment = comments.find(c => c._id === commentID);
        if (!comment) return false;

        // Check if the current comment matches any search term
        const commentMatches = searchTerms.some(term =>
            comment.content.toLowerCase().includes(term.toLowerCase())
        );

        // Recursively check replies for matches
        const replyMatches = comment.commentIDs.some(replyID =>
            searchComments(replyID, searchTerms)
        );

        return commentMatches || replyMatches;
    };

    const handleKeyPress = (e) => {

        if (e.key === 'Enter') {
            const trimmedSearchString = searchString.trim();
            const searchTerms = trimmedSearchString.split(' ').filter(term => term !== '');
            
           // Perform the search on posts
            const searchedPosts = posts.filter(post => {
                // Check if any search term matches the post title or content
                const postMatches = searchTerms.some(term =>
                    post.title.toLowerCase().includes(term.toLowerCase()) ||
                    post.content.toLowerCase().includes(term.toLowerCase())
                );

                // Check through comments using the recursive search function
                const commentMatches = post.commentIDs.some(commentID =>
                    searchComments(commentID, searchTerms)
                );

                // Return true if either the post (title or content) or any comment matches the search terms
                return postMatches || commentMatches;
            });

            console.log("Search results: ", searchedPosts)
            // Call displayPosts with the search results
            loadPage("searchResults",null, null, searchedPosts, searchString)

            setSearchString("")
        }
    };


    return (
        <div className="search-bar-container">
            <input
                className="search-bar"
                type="text"
                placeholder="Search..."
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                onKeyDown={handleKeyPress}
            />
        </div>
    );
};

export default SearchBar;