import React, {useEffect, useState}from 'react';
import { UsePhredditContext } from './phredditContext';
import { usePostDeletion } from './functions';
import { deleteCommunity, deleteUser} from './api';

const UserProfile = () => {
    const {deleteCommentsRecursively, deletePosts} = usePostDeletion()
    const { selectedUser, user, setSelectedUser, communities, posts, comments, setSelectedCommunity, loadPage, 
            setSelectedPost, setSelectedComment, users, setUsers, setCommunities
    } = UsePhredditContext();
    const [activeListing, setActiveListing] = useState('');
    const [userToDelete, setUserToDelete] = useState(null);

    
    useEffect(() => {
        console.log('Updated Comments:', comments);
      }, [comments])

    useEffect(() => {
        if(selectedUser.role === "admin"){
            setActiveListing('users')
        }else{
            setActiveListing('posts')
        }
    }, [selectedUser]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleCommunity = (community) => {
        setSelectedCommunity(community)
        console.log(community)
        loadPage("createCommunity")
    }

    const handlePost = (post) => {
        setSelectedPost(post)
        loadPage("createPost")
    }

    const handleComment = (comment) => {
        setSelectedComment(comment)
        loadPage("post")
    }

    const handleUser = (user) => {
        setSelectedUser(user)
        loadPage('userProfile')
    }

    const handleBack = () => {
        setSelectedUser(user)
        loadPage('userProfile')
    }

    const getParentCommentsForDeletion = (userToDelete) => {
        // Create a Set to store all reply IDs
        const replyIds = new Set();
        const userComments = new Set();  // To store comments made by the user
    
        // First, iterate over all comments to gather replies and identify user comments
        comments.forEach((comment) => {
            if (comment.commentIDs && comment.commentIDs.length > 0) {
                comment.commentIDs.forEach((replyId) => replyIds.add(replyId)); // Store reply IDs
            }
    
            if (comment.createdBy === userToDelete.displayName) {
                userComments.add(comment._id); // Store user comments
            }
        });
    
        // Now filter comments to get only the ones that are relevant for deletion
        const parentComments = comments.filter((comment) => {
            // Check if the comment is created by the user and not a reply (parent comment)
            const isReply = replyIds.has(comment._id); // Check if the comment is a reply
            const isUserComment = comment.createdBy === userToDelete.displayName;
            
            if (isUserComment && !isReply) {
                // If the user made a parent comment, return it
                return true;
            }
    
            if (isUserComment && isReply) {
                // If the user made a reply, return the reply only if it's to another user
                const parentComment = comments.find((c) => c.commentIDs && c.commentIDs.includes(comment._id));
                if (parentComment && parentComment.createdBy !== userToDelete.displayName) {
                    return true; // This reply is to another user, so include it
                }
            }
    
            // Return false for any other cases (not user comment or reply to self)
            return false;
        });
    
        return parentComments;
    };
    
    
    
    
    const handleDeleteUser = async () => {
       
        const userComments = getParentCommentsForDeletion(userToDelete);
        console.log("All the comments left to delete: ", userComments)
        for(const commentToDelete of userComments){
            console.log("comment to delete: ", commentToDelete)
            await deleteCommentsRecursively(commentToDelete)
        }

        const userCommunities = communities.filter(community => community.createdBy === userToDelete.displayName);
        console.log("userCommunities: ", userCommunities)
        for(const communityToDelete of userCommunities){
            console.log("community to delete: " , communityToDelete)
            console.log("community id: ", communityToDelete)
            await deletePosts(communityToDelete.postIDs)
            await deleteCommunity(communityToDelete._id)
            setCommunities(prev => prev.filter(community => community._id !== communityToDelete._id));
        }

        const userPosts = posts.filter(post => post.createdBy === userToDelete.displayName)
        for(const postToDelete of userPosts){
            console.log("post to delete: ", postToDelete)
            await deletePosts([postToDelete._id])
        }
        

        await deleteUser(userToDelete._id)
        setUsers(prev => prev.filter( user => user._id !== userToDelete._id))
        setUserToDelete(null)
    }
    

    const renderListing = () => {
        switch (activeListing) {
            case 'users':
                return users.length > 0 ? (
                    <div className="card-list">
                        {users.map(user => (
                            user.displayName != selectedUser.displayName && (
                            <>
                            <div key={user._id} className="card">
                               <div class="grid-container">
                                    <div class="column-left" onClick = {() => handleUser(user)}>
                                        <h3>{user.displayName}</h3>
                                        <p>Email: {user.email}</p>
                                        <p>Reputation: {user.reputation}</p>
                                    </div>
                                    <div class="column-right">
                                        <button className="delete-button" onClick = {() => setUserToDelete(user)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {userToDelete && (
                                <div className="confirmation-popup">
                                    <div className="popup-content">
                                        <h2>Are you sure you want to delete this user?</h2>
                                        <p>This action cannot be undone.</p>
                                        <button onClick = {() => handleDeleteUser(userToDelete)}>Yes, delete</button>
                                        <button onClick={() => setUserToDelete(null)}>Cancel</button>
                                    </div>
                                </div>
                            )} </>
                        )
                        ))} 
                        
                    </div>
                ) : (
                    <p>No posts found.</p>
                );
            case 'posts':
                return posts.length > 0 ? (
                    <div className="card-list">
                        {posts.map(post => (
                            post.createdBy === selectedUser.displayName && (
                            <div key={post._id} className="card" onClick = {() => handlePost(post)}>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                <p>Posted on: {formatDate(post.postedDate)}</p>
                            </div>
                        )
                        ))}
                    </div>
                ) : (
                    <p>No posts found.</p>
                );
            case 'communities':
                return communities.length > 0 ? (
                    <div className="card-list" >
                        {communities.map(community => (
                            community.createdBy === selectedUser.displayName && (
                            <div key={community._id} className="card" onClick = {() => handleCommunity(community)}>
                                <h3>{community.name}</h3>
                                <p>Members: {community.members.length}</p>
                            </div>
                            )
                        ))}
                    </div>
                ) : (
                    <p>No communities found.</p>
                );
            case 'comments':
                return comments.length > 0 ? (
                    <div className="card-list" >
                        {comments.map(comment => (
                            comment.createdBy === selectedUser.displayName && (
                            <div key={comment._id} className="card" onClick = {() => handleComment(comment)}>
                                <h3>{comment.content}</h3>
                                <p>Commented on: {comment.postTitle}</p>
                            </div>
                            )
                        ))}
                    </div>
                ) : (
                    <p>No comments found.</p>
                );
            default:
                return null;
        }
    };
    

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            {selectedUser != user && <button onClick = {handleBack}>Return to Profile</button>}
            <h1 style={{ textAlign: 'center' }}>User Profile</h1>
            <div style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    {/* <img 
                        src={selectedUser.avatar || 'https://via.placeholder.com/150'} 
                        alt={`${selectedUser.displayName}'s avatar`}
                        style={{ borderRadius: '50%', width: '100px', height: '100px', marginRight: '20px' }}
                    /> */}
                    <h2>{selectedUser.displayName || 'Guest User'}</h2>
                </div>
                <p><strong>Member Since:</strong> {formatDate(selectedUser.dateJoined) || 'Unknown'}</p>
                <p><strong>Email:</strong> {selectedUser.email || 'Not provided'}</p>
                <p><strong>Reputation:</strong> {selectedUser.reputation}</p>
                
            </div>
           

            <div className="listing-buttons">
                {selectedUser.role === "admin" && <button
                    className={activeListing === 'users' ? 'active' : ''}
                    onClick={() => setActiveListing('users')}
                >
                    Users
                </button>}
                <button
                    className={activeListing === 'posts' ? 'active' : ''}
                    onClick={() => setActiveListing('posts')}
                >
                    Posts
                </button>
                <button
                    className={activeListing === 'communities' ? 'active' : ''}
                    onClick={() => setActiveListing('communities')}
                >
                    Communities
                </button>
                <button
                    className={activeListing === 'comments' ? 'active' : ''}
                    onClick={() => setActiveListing('comments')}
                >
                    Comments
                </button>
            </div>

            <hr></hr>

            {/* Render the current listing */}
            <div className="listing-content">{renderListing()}</div>

            

        </div>
    );
};

export default UserProfile;
