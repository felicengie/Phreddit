import React, { useState, useEffect } from 'react';
import { getTimeDifference, calculateCommentCount } from './functions';
import CreateComment from './NewCommentPage/CreateComment.jsx';
import { UsePhredditContext } from './phredditContext.js';
import { createComment, updateComment, updatePost, updateUser, fetchUserByDisplayName} from './api.js';


const PostPage = () => {
    const {posts, currentPostID, communities, linkflairs, comments, setComments, setPosts, user, selectedComment, setSelectedComment, loadPage} = UsePhredditContext()
    const [post, setPost] = useState(posts.find(p => p._id === currentPostID));
    const [community, setCommunity] = useState(communities.find(c => c.postIDs.includes(currentPostID)));
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [currentCommentID, setCurrentCommentID] = useState(null);

    useEffect(() => {
    const foundPost = posts.find(p => p._id === currentPostID);
    const foundCommunity = communities.find(c => c.postIDs.includes(currentPostID));
    
    if (selectedComment) {
        setShowCommentForm(true)
    }
    const updateViewCount = async () => {
      if (foundPost) {
          setPost({ ...foundPost, views: foundPost.views + 1 }); // Local view count increment
          foundPost.views += 1; // Update model data view count
          const updateViewCount = await updatePost(foundPost._id, foundPost)
          setCommunity(foundCommunity);
    }}

    updateViewCount();
    }, [currentPostID, selectedComment]);

    if (!post || !community) return <div>Loading...</div>;

    const linkFlairData = linkflairs.find(flair => flair._id === post.linkFlairID);

    const renderVoteButtons = (postOrComment) => {
        const voteCount = postOrComment.upvoters.length - postOrComment.downvoters.length
        return (
        <>
             {user ? (
            <>
                <div className="vote-container">
                    <button 
                        disabled={postOrComment.createdBy === user.displayName || user.reputation < 50}
                        className={`vote-button upvote ${postOrComment.upvoters?.includes(user.displayName) ? 'selected' : ''}`}
                        onClick={() => handleVote('upvote', postOrComment)}
                    >
                        ↑
                    </button>
                    <div className = "counter">{voteCount}</div>
                    <button 
                        disabled={postOrComment.createdBy === user.displayName || user.reputation < 50}
                        className={`vote-button downvote ${postOrComment.downvoters?.includes(user.displayName) ? 'selected' : ''}`}
                        onClick={() => handleVote('downvote', postOrComment)}
                    >
                        ↓
                    </button>
                </div>
            </>
        ) : (
            <> Vote Count: {voteCount}</>
        )}
        </>
    )};

    const displayComments = (comments, commentIDs = [], level = 0) => {
      if (!Array.isArray(commentIDs) || commentIDs.length === 0) {
          // If there are no comment IDs to display, return an empty JSX element
          return <div>No comments yet.</div>;
      }
  
      // Sort the top-level commentIDs based on the commentedDate in descending order
      const sortedCommentIDs = commentIDs
          .map(id => comments.find(c => c._id === id)) // Map IDs to comment objects
          .filter(comment => comment && comment.commentedDate) // Filter out undefined or invalid comments
          .sort((a, b) => new Date(b.commentedDate) - new Date(a.commentedDate)) // Sort by date
  
    //   // If no valid comments exist after filtering, return a message
    //   if (sortedCommentIDs.length === 0) {
    //       return <div>No comments yet.</div>;
    //   }
  
      return sortedCommentIDs.map(comment => (
          <div key={comment._id} className="comment-wrapper" style={{ marginLeft: `${level * 20}px` }}>
              <div>{comment.createdBy} | {getTimeDifference(comment.commentedDate)}</div>
              <div>{comment.content}</div>
  
              {/* Reply button */}
              <div className = "counts">
              {user && <button onClick={() => handleAddCommentClick(comment._id)}>Reply</button>}
              
              {renderVoteButtons(comment)}
              </div>
              {/* Recursively display replies (if any) */}
              {comment.commentIDs && comment.commentIDs.length > 0 && displayComments(comments, comment.commentIDs, level + 1)}
          </div>
      ));
  };

    const handleAddCommentClick = (commentID) => {
        setShowCommentForm(true); // Show the comment form when "Add a comment" is clicked
        setCurrentCommentID(commentID)
    };

    const handleVote = async (type, itemToUpdate) => {
        if (!user) return; // Ensure the user is logged in
        console.log("ITEM: ", itemToUpdate)
        const isUpvoted = itemToUpdate.upvoters.includes(user.displayName);
        const isDownvoted = itemToUpdate.downvoters.includes(user.displayName);
        let reputationChange = 0; 
        // Prevent multiple votes by the same user
        if (type === 'upvote') {
            if (isUpvoted) {
                // Undo the upvote
                itemToUpdate.upvoters = itemToUpdate.upvoters.filter(id => id !== user.displayName);
                // Subtract the previous reputation change (if any)
                reputationChange = -5;
            } else {
                // Add upvote and undo downvote if present
                if (isDownvoted) {
                    itemToUpdate.downvoters = itemToUpdate.downvoters.filter(id => id !== user.displayName);
                    reputationChange = 15; // Undo downvote (-10) and add upvote (+5)
                } else {
                    reputationChange = 5; // New upvote
                }
                itemToUpdate.upvoters.push(user.displayName);
            }
        } else if (type === 'downvote') {
            if (isDownvoted) {
                // Undo the downvote
                itemToUpdate.downvoters = itemToUpdate.downvoters.filter(id => id !== user.displayName);
                // Subtract the previous reputation change (if any)
                reputationChange = 10;
            } else {
                // Add downvote and undo upvote if present
                if (isUpvoted) {
                    itemToUpdate.upvoters = itemToUpdate.upvoters.filter(id => id !== user.displayName);
                    reputationChange = -15; // Undo upvote (+5) and add downvote (-10)
                } else {
                    reputationChange = -10; // New downvote
                }
                itemToUpdate.downvoters.push(user.displayName);
            }
        }
        try {
            let updatedItem;
            if (itemToUpdate.title) {   
                updatedItem = await updatePost(itemToUpdate._id, itemToUpdate);
                setPosts((prevPosts) =>
                    prevPosts.map((p) => (p._id === itemToUpdate._id ? updatedItem : p))
                );
            } else if (itemToUpdate.commentedDate) { // Assuming a comment has content
                updatedItem = await updateComment(itemToUpdate._id, itemToUpdate);
                setComments((prevComments) =>
                    prevComments.map((c) => (c._id === itemToUpdate._id ? updatedItem : c))
                );
            } else {
                throw new Error('Item is neither a post nor a comment');
            }
            console.log(reputationChange)
            console.log(itemToUpdate.createdBy)
            const retrieveUser = await fetchUserByDisplayName(itemToUpdate.createdBy)
            const updatedUser = {
                ...retrieveUser,
                reputation: retrieveUser.reputation + reputationChange,
            };
            const userUpdated = await updateUser(updatedUser._id, updatedUser);
            console.log(userUpdated)
        } catch (error) {
            console.error('Error updating vote:', error);
        }
    
    };

    const handleSubmitComment = async (newCommentData) => {
      // Handle the new comment submission
      const addComment = {
          content: newCommentData.commentContent,
          commentIDs: [], // Initialize an empty array for any potential replies
          createdBy: user.displayName,
          commentedDate: new Date(), // Set the current date
          upvoters: [],
          downvoters: []
      };

      console.log("comment data: ", addComment)
      
      if(selectedComment){
        const updatedComment = await updateComment(selectedComment._id, addComment)
        setComments((prevComments) => [...prevComments, updatedComment]);
        setSelectedComment(null)
        loadPage('userProfile')
      }else{

        const newComment = await createComment(addComment); // Variable with a unique name
        setComments((prevComments) => [...prevComments, newComment]);

      console.log("created comment successfully", newComment)
      
      
      // If it's a reply to an existing comment, update the parent's commentIDs
      if (newCommentData.parentCommentID) {
        console.log("parent id: ", newCommentData.parentCommentID)
        const parentComment = comments.find((comment) => comment._id === newCommentData.parentCommentID);
        console.log("parent comment found: ", parentComment)
          if (parentComment) {
              parentComment.commentIDs.push(newComment._id);
              console.log("Updated parentComment: ", parentComment)
              console.log("calling updateComment api: ", parentComment._id, parentComment)
              const updatedComment = await updateComment(parentComment._id, parentComment);
              console.log("Updated comment: ", updatedComment)
              setComments((prevComments) =>
                  prevComments.map((comment) =>
                      comment._id === parentComment._id ? updatedComment : comment
                  )
              );
          }
      } else {
          post.commentIDs.push(newComment._id);
          console.log("New comment id: ", newComment._id)
          const updatedPost = await updatePost(post._id, post);
          console.log("Updated Post: ", updatedPost)
          setPosts((prevPosts) =>
              prevPosts.map((p) => (p._id === post._id ? updatedPost : p))
          );
      }

      }
      
  
      setShowCommentForm(false); // Hide the form after submission
  };
  
    


    return (
        <div className="postPage">
            {!showCommentForm ? (
                <>
                <header className="postPage-header">
                <span className="community-name">{community.name}</span>
                <span className="posted-by"> | {post.createdBy}</span>
                <span className="post-timestamp"> | {getTimeDifference(post.postedDate.toLocaleString())}</span>
                
                <h1 className="post-title">{post.title}</h1>
                {linkFlairData && <div className="link-flair">{linkFlairData.content}</div>}
                <div className="post-content">{post.content}</div>
                <div className="counts">
                    <span className="view-count">Views: {post.views}</span>
                    <span className="comment-count"> Comments: {calculateCommentCount(post,comments)}</span>
                    {renderVoteButtons(post)}
                </div>
                </header>
                <button onClick={() => handleAddCommentClick(null)}>Add a comment</button>
                <hr />
                <div className="comments-section">
                    {displayComments(comments, post.commentIDs)}
                </div>
                </>
            ) : (<CreateComment postID={currentPostID} parentCommentID = {currentCommentID} onSubmit={handleSubmitComment} />)}
        </div>
    );
};

export default PostPage;