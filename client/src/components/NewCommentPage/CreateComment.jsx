import React, { useState, useEffect } from 'react';
import { UsePhredditContext } from '../phredditContext';
import { usePostDeletion } from '../functions';

const CreateComment = ({ postID, parentCommentID = null, onSubmit }) => {
  const {deleteCommentsRecursively} = usePostDeletion()
  const [commentContent, setCommentContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [commentError, setCommentError] = useState('');
  const {user, selectedComment, setSelectedComment, loadPage, comments} = UsePhredditContext()
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  useEffect(() => {
    
    if (selectedComment) {
        setCommentContent(selectedComment.content);
    }
  }, [selectedComment]);

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = () => {
    if (!commentContent) {
      setCommentError('Comment is required.');
      return;
    }
    // Call the onSubmit function passed as a prop with the comment data
    onSubmit({ postID, parentCommentID, commentContent});
  };

  const showConfirm = (e) => {
    e.preventDefault()
    console.log("show")
    setShowConfirmation(true);
  }

  const handleDelete = () => {
    setSelectedComment(null)
    setShowConfirmation(false)
    deleteCommentsRecursively(selectedComment)
    console.log(comments)
    loadPage("userProfile")
  }

  return (
    <div className="comment-form">
      <h2>{parentCommentID ? 'Reply to Comment' : 'Add a Comment'}</h2>
      <div>
        <label htmlFor="comment-content">
        <div>
          <label htmlFor="username"><b> Username: </b>{user.displayName}
          </label>
          <br></br>
        </div>
          Comment: <span className="required">*</span>
        </label>
        <textarea
          id="comment-content"
          maxLength="500"
          rows="5"
          placeholder="Enter your comment..."
          value={commentContent}
          onChange={handleCommentChange}
        />
        <div className="char-counter">{charCount}/500</div>
        {commentError && <div className="error-message">{commentError}</div>}
      </div>
     
      <button onClick={handleSubmit}>{selectedComment ? "Update Comment" : "Submit Comment"}</button>
      <button className = "delete-button" onClick={(e) => showConfirm(e)} hidden = {!selectedComment}>Delete</button>
      {showConfirmation && (
            <div className="confirmation-popup">
                <div className="popup-content">
                    <h2>Are you sure you want to delete this comment?</h2>
                    <p>This action cannot be undone.</p>
                    <button onClick = {handleDelete}>Yes, delete</button>
                    <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                </div>
            </div>
            )}
    </div>
  );
};

export default CreateComment;