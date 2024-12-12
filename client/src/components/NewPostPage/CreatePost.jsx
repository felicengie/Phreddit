import React, { useState, useEffect } from 'react';
import '../../stylesheets/index.css';
import CommunitySelect from './CommunitySelect';
import PostTitle from './PostTitle';
import LinkFlair from './LinkFlair';
import PostContent from './PostContent';
import ErrorMessage from './ErrorMessage';
import { UsePhredditContext } from '../phredditContext';
import { createPost, createLinkFlair, updateCommunity, updatePost } from '../api';
import { usePostDeletion } from '../functions';

const CreatePost = () => {
    const {deletePosts} = usePostDeletion()
    const {communities, linkflairs, loadPage, setPosts, setCommunities, setLinkFlairs, user, selectedPost, setSelectedPost} = UsePhredditContext()

    const [communityID, setCommunityID] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [selectedFlair, setSelectedFlair] = useState('');
    const [newFlair, setNewFlair] = useState('');
    const [postContent, setPostContent] = useState('');
    const [errors, setErrors] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false)

    useEffect(() => {
        // If there's a selected community, populate the form with its data
        if (selectedPost) {
           setCommunityID(selectedPost.communityID)
           setPostTitle(selectedPost.title)
           setSelectedFlair(selectedPost.linkFlairID)
           setPostContent(selectedPost.content)
           console.log(selectedPost)
        }

    }, [selectedPost]);
    
    const validateInputs = () => {
        const newErrors = {};
        if (!communityID) newErrors.community = 'Please select a community.';
        if (!postTitle) newErrors.title = 'Post title is required.';
        if (newFlair && newFlair.length > 30) {
            newErrors.flair = 'New link flair must be 30 characters or less.';
        } else if (selectedFlair && newFlair) {
            newErrors.flair = 'You can only apply one link flair. Please choose one option.';
        }
        if (!postContent) newErrors.content = 'Post content is required.';
        return newErrors;
    };

    const handleCreatePost = async (event) => {
        event.preventDefault();
        const newErrors = validateInputs();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        let linkFlairID = selectedFlair || null;

        // Step 1: Create the new link flair if needed
        if (newFlair) {
            const createdLinkFlair = await createLinkFlair(newFlair);
            linkFlairID = createdLinkFlair._id;
            setLinkFlairs(prev => [...prev, createdLinkFlair]);
        }

        // If valid, create a new post
        const postData = {
            // postID: `p${posts.length + 1}`, // Unique ID for the post
            title: postTitle,
            content: postContent,
            linkFlairID: linkFlairID,
            createdBy: user.displayName,
            postedDate: new Date(), // Set the current date
            commentIDs: [], // Initialize with no comments
            downvoters: [],
            upvoters: [],
            views: 0, // Initialize views count
        };

        if (selectedPost) {
            // Update existing post
            const updatedPost = await updatePost(selectedPost._id, postData);
            
            // Remove post ID from the community's postIDs array
            const communityToUpdate = communities.find(comm => comm._id === communityID);
            if (communityToUpdate) {
                const updatedPostIDs = communityToUpdate.postIDs.filter(postID => postID !== selectedPost._id);
                await updateCommunity(communityID, { postIDs: updatedPostIDs });
                
                // Update the community in local state
                setCommunities(prevCommunities =>
                    prevCommunities.map(comm =>
                        comm._id === communityID ? { ...comm, postIDs: updatedPostIDs } : comm
                    )
                );
            }
            
            setPosts(prevPosts =>
                prevPosts.map(post => (post._id === updatedPost._id ? updatedPost : post))
            );
        } else {
            // Create a new post
            const createdPost = await createPost(postData);
            setPosts(prevPosts => [createdPost, ...prevPosts]);

            const updatedCommunity = communities.find(comm => comm._id === communityID);
            if (updatedCommunity) {
                const updatedPostIDs = [...updatedCommunity.postIDs, createdPost._id];
                await updateCommunity(communityID, { postIDs: updatedPostIDs });
                setCommunities(prevCommunities =>
                    prevCommunities.map(comm =>
                        comm._id === communityID ? { ...comm, postIDs: updatedPostIDs } : comm
                    )
                );
            }
        }

    loadPage('home')

    };
    const showConfirm = (e) => {
        e.preventDefault()
        console.log("show")
        setShowConfirmation(true);
    }

    const handleDeletePost = () => {
        deletePosts([selectedPost._id])
        setSelectedPost(null)
        setShowConfirmation(false)
        loadPage('userProfile')
    }

    return (
        <div>
            <h1>Create a New Post</h1>
            <form onSubmit={handleCreatePost}>
                <div><b>Username</b>: {user.displayName}</div>
                <CommunitySelect communities={communities} onSelect={setCommunityID} />
                {errors.community && <ErrorMessage message={errors.community}/>}
                
                <PostTitle title={postTitle} onTitleChange={setPostTitle} />
                {errors.title && <ErrorMessage message={errors.title} />}

                
                <LinkFlair
                    linkFlairs={linkflairs}
                    selectedFlair={selectedFlair}
                    onSelectFlair={setSelectedFlair}
                    newFlair={newFlair}
                    onNewFlairChange={setNewFlair}
                />
                {errors.flair && <ErrorMessage message={errors.flair} />}

                <PostContent content={postContent} onContentChange={setPostContent} />
                {errors.content && <ErrorMessage message={errors.content}/>}
                
                {errors.username && <ErrorMessage message={errors.username} />}


                <button type="submit">{selectedPost ? 'Update Post' : 'Submit Post'}</button>
                <button className = "delete-button" onClick={(e) => showConfirm(e)} hidden = {!selectedPost}>Delete</button>
            </form>
            
            {/* Confirmation Popup */}
            {showConfirmation && (
                    <div className="confirmation-popup">
                        <div className="popup-content">
                            <h2>Are you sure you want to delete this post?</h2>
                            <p>This action cannot be undone.</p>
                            <button onClick={handleDeletePost}>Yes, delete</button>
                            <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                        </div>
                    </div>
            )}
        </div>
    );
};

export default CreatePost;