// api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Fetch data with error handling
export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;  // Propagate error so that it can be handled in the component
  }
};

export const fetchPost = async (postID) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;  // Propagate error so that it can be handled in the component
  }
};

export const fetchComments = async () => {
  try {
    const response = await axios.get(`${API_URL}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const fetchComment = async (commentID) => {
  try {
    const response = await axios.get(`${API_URL}/comments/${commentID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comment:', error);
    throw error;  // Propagate error so that it can be handled in the component
  }
};

export const fetchCommunities = async () => {
  try {
    const response = await axios.get(`${API_URL}/communities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching communities:', error);
    throw error;
  }
};

export const fetchLinkFlairs = async () => {
  try {
    const response = await axios.get(`${API_URL}/linkflairs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching link flairs:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try{
    const response = await axios.get(`${API_URL}/users`)
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  } 
}

export const fetchUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/users/email/${email}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
};

export const fetchUserByDisplayName = async (displayName) => {
  try {
    const response = await axios.get(`${API_URL}/users/displayName/${displayName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with displayName ${displayName}:`, error);
    throw error;
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};


// Create, update, and delete posts with error handling
export const createPost = async (post) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, post);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const createLinkFlair = async (flairContent) => {
  try {
    const response = await axios.post(`${API_URL}/linkflairs`, { content: flairContent });
    return response.data; // This should return the new linkFlair with its generated ID
  } catch (error) {
    console.error('Error creating link flair:', error);
    throw error;
  }
};

export const createCommunity = async (community) =>{
  try{
    const response = await axios.post(`${API_URL}/communities`, community)
    return response.data;
  }catch (error){
    console.log("Error creating community", error)
    throw error;
  }
}

export const createComment = async (comment) => {
  try{
    const response = await axios.post(`${API_URL}/comments`, comment)
    return response.data
  }catch(error){
    console.log("Error creating comment", error)
    throw error;
  }
}

export const createUser = async (user) => {
  try{
    const response = await axios.post(`${API_URL}/users`, user)
    return response.data
  }catch(error){
    console.log("Error creating user", error)
    throw error;
  }
}

export const updatePost = async (postId, post) => {
  try {
    const response = await axios.put(`${API_URL}/posts/${postId}`, post);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const updateCommunity = async (communityID, updatedCommunityData) => {
  try {
    const response = await axios.put(`${API_URL}/communities/${communityID}`, updatedCommunityData);
    return response.data;
  } catch (error) {
    console.error('Error updating community:', error);
    throw error;
  }
};

export const updateComment = async (commentID, updatedCommentData) =>{
  try{
    const response = await axios.put(`${API_URL}/comments/${commentID}`, updatedCommentData)
    return response.data
  } catch (error){
    console.error('Error updating comment:', error);
    throw error;
  }
}

export const updateUser = async (userID, updatedUserData) =>{
  try{
    const response = await axios.put(`${API_URL}/users/${userID}`, updatedUserData)
    return response.data
  } catch (error){
    console.error('Error updating user:', error);
    throw error;
  }
}

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const deleteComment = async (commentID) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${commentID}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const deleteCommunity = async (communityID) => {
  try {
    console.log("attemtping to delete community with id: ", communityID)
    const response = await axios.delete(`${API_URL}/communities/${communityID}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting community:', error);
    throw error;
  }
};


export const deleteUser = async (userID) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userID}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting User:', error);
    throw error;
  }
};

