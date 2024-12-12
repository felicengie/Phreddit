import React, { useState, useEffect } from 'react';
import '../../stylesheets/index.css';
import { UsePhredditContext } from '../phredditContext';
import { createCommunity, updateCommunity, deleteComment, deletePost, fetchPost, fetchComment, deleteCommunity } from '../api';
import {usePostDeletion} from '../functions';

const NewCommunityPage = () => {
    const { deletePosts } = usePostDeletion();
    const {loadPage, communities, setCommunities, user, selectedCommunity, setSelectedCommunity, setComments, posts, setPosts, comments} = UsePhredditContext();
    const [communityName, setCommunityName] = useState('');
    const [communityDescription, setCommunityDescription] = useState('');
    const [errors, setErrors] = useState({ name: '', description: '' });
    const [showConfirmation, setShowConfirmation] = useState(false); // To control the visibility of the confirmation popup

    useEffect(() => {
        // If there's a selected community, populate the form with its data
        if (selectedCommunity) {
            setCommunityName(selectedCommunity.name);
            setCommunityDescription(selectedCommunity.description);
        }
    }, [selectedCommunity]);

    const handleCreateCommunity = async (event) => {
        event.preventDefault();
        let isValid = true;
        const newErrors = { name: '', description: ''};

        // Validate inputs
        if (!communityName.trim()) {
            newErrors.name = 'Community name is required.';
            isValid = false;
        }
        if (!communityDescription.trim()) {
            newErrors.description = 'Description is required.';
            isValid = false;
        }

        // Check for duplicate community names
        const isDuplicate = communities.some(community => community.name.toLowerCase() === communityName.toLowerCase());
        if (isValid && isDuplicate && !selectedCommunity) {
            newErrors.name = 'A community with this name already exists. Please choose a different name.';
            isValid = false;
        }    

        // Update errors state
        setErrors(newErrors);

        // If valid, create or update the community
        if (isValid) {
            const communityData = {
                name: communityName,
                description: communityDescription,
                postIDs: selectedCommunity ? selectedCommunity.postIDs : [],
                startDate: selectedCommunity ? selectedCommunity.startDate : new Date(),
                members: selectedCommunity ? selectedCommunity.members : [user.displayName],
                createdBy: selectedCommunity ? selectedCommunity.createdBy : user.displayName
            };

            let createdCommunity
            try {
                if (selectedCommunity) {
                    // Update the selected community
                    const updatedCommunity = await updateCommunity(selectedCommunity._id, communityData);
                    setCommunities(prev => prev.map(community => community._id === updatedCommunity._id ? updatedCommunity : community));
                    setSelectedCommunity(null) // Clear the selected community after update
                } else {
                    // Create a new community
                    createdCommunity = await createCommunity(communityData);
                    setCommunities(prev => [...prev, createdCommunity]);
                }

                // Navigate to the community page
                loadPage('community', selectedCommunity ? selectedCommunity._id : createdCommunity._id);

                // Reset form fields
                setCommunityName('');
                setCommunityDescription('');
                setErrors({ name: '', description: ''});
            } catch (error) {
                // Handle error (e.g., show a notification or log it)
                console.error('Error creating/updating community:', error);
            }
        }
    };

    // const deleteCommentsRecursively = async (comment) => {
    //     console.log(comment)
    //     try {
    //       // If the comment has replies (commentIDs), recursively delete those first
    //       if (comment.commentIDs && comment.commentIDs.length > 0) {
    //         for (const replyId of comment.commentIDs) {
    //           const reply = comments.find((r) => r._id === replyId);
    //           await deleteCommentsRecursively(reply); // Recursively delete each reply
    //         }
    //       }
      
    //       // Now that all replies are deleted, delete the current comment
    //       await deleteComment(comment._id);
    //       console.log(`Deleted comment with ID: ${comment._id}`);
      
    //       // Optionally, remove the deleted comment from the state to update the UI
    //       // This assumes you have a state like 'comments' where you store the comments list
    //       setComments((prevComments) =>
    //         prevComments.filter((c) => c._id !== comment._id)
    //       );
    //       console.log(`comments array: ${comments}`);
          
    //     } catch (error) {
    //       console.error('Error deleting comment:', error);
    //     }
    //   };

    //   const deletePosts = async (postIDs) => {
    //     try {
    //         for (const postID of postIDs) {
    //           console.log(`Deleting post with ID: ${postID}`);
                
    //           const post = await fetchPost(postID);
    //           if (!post) {
    //             console.warn(`Post with ID: ${postID} not found or already deleted.`);
    //             return;
    //           }
              
    //           console.log(`Post with ID: ${postID} fetched successfully.`);

    //           // Step 2: Fetch and recursively delete associated comments
    //             if (post.commentIDs && post.commentIDs.length > 0) {
    //                 console.log(`Processing ${post.commentIDs.length} comments associated with the post.`);
    //                 for (const commentID of post.commentIDs) {
    //                 console.log("CommentID: ", commentID)
    //                 const comment = await fetchComment(commentID);
    //                 if (comment) {
    //                     await deleteCommentsRecursively(comment); // Call the recursive function directly
    //                 }
    //                 }
    //             }
    //           // Call the API to delete the post
    //             await deletePost(postID); // Ensure `deletePost` is implemented to make an API request
    //             // Update the state to remove the deleted post
    //             setPosts((prevPosts) =>
    //                 prevPosts.filter((p) => p._id !== postID)
    //             );
    //             console.log(`Post with ID: ${postID} deleted successfully.`);
    //         }
    //         console.log("All posts in the community have been deleted.");
    //         console.log("posts array now: ", posts)
          
    //     } catch (error) {
    //         console.error("Error deleting posts:", error);
    //     }
    //   }

    // Function to handle deletion
    const handleDeleteCommunity = async () => {
        try {
            // Call API to delete the community
            deletePosts(selectedCommunity.postIDs)
            await deleteCommunity(selectedCommunity._id); // Assuming selectedCommunity._id is the community's unique ID
            // Remove the community from the state
            setCommunities(prev => prev.filter(community => community._id !== selectedCommunity._id));
            // Reset the selected community state
            setSelectedCommunity(null);
            setShowConfirmation(false); // Close the confirmation popup
            loadPage("userProfile")
        } catch (error) {
            console.error('Error deleting community:', error);
            // You can show an error message here if needed
        }
    };
    const showConfirm = (e) => {
        e.preventDefault()
        console.log("show")
        setShowConfirmation(true);
    }
    return (
        <div>
            <h1>Tell us about your community</h1>
            <p>A name and description help people understand what your community is all about.</p>
            <form onSubmit={handleCreateCommunity}>
                <div>
                    <label htmlFor="community-name">Community Name <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="text"
                        id="community-name"
                        value={communityName}
                        onChange={(e) => setCommunityName(e.target.value)}
                        maxLength={100}
                        // required
                    />
                    <div className="character-counter">
                        {communityName.length}/100
                    </div>
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
                <div>
                    <label htmlFor="community-description">Description <span style={{ color: 'red' }}>*</span></label>
                    <textarea
                        id="community-description"
                        value={communityDescription}
                        onChange={(e) => setCommunityDescription(e.target.value)}
                        maxLength={500}
                        // required
                    />
                     <div className="character-counter">
                        {communityDescription.length}/500
                    </div>
                    {errors.description && <div className="error-message">{errors.description}</div>}
                </div>
                 <button type="submit">{selectedCommunity ? 'Update Community' : 'Create Community'}</button>
                 <button className = "delete-button" onClick={(e) => showConfirm(e)} hidden = {!selectedCommunity}>Delete</button>
            </form>
            
            {/* Confirmation Popup */}
            {showConfirmation && (
                    <div className="confirmation-popup">
                        <div className="popup-content">
                            <h2>Are you sure you want to delete this community?</h2>
                            <p>This action cannot be undone.</p>
                            <button onClick={handleDeleteCommunity}>Yes, delete</button>
                            <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                        </div>
                    </div>
            )}
        </div>
    );
};

export default NewCommunityPage;