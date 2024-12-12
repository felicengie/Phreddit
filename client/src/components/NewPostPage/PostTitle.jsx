import React from 'react';

const PostTitle = ({ title, onTitleChange }) => (
    <div>
        <label htmlFor="post-title">Post Title: <span className="required" style={{ color: 'red' }}>*</span></label>
        <input
            type="text"
            id="post-title"
            value={title}
            maxLength="100"
            placeholder="Enter post title"
            onChange={e => onTitleChange(e.target.value)}
        />
        <div className="char-counter">{title.length}/100</div>
    </div>
);

export default PostTitle;