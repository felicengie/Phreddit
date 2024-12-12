import React from 'react';

const PostContent = ({ content, onContentChange }) => (
    <div>
        <label htmlFor="post-content">Post Content: <span className="required">*</span></label>
        <textarea
            id="post-content"
            value={content}
            placeholder="Enter post content"
            onChange={e => onContentChange(e.target.value)}
        />
    </div>
);

export default PostContent;