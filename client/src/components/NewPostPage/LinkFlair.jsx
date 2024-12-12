import React from 'react';

const LinkFlair = ({ linkFlairs = [], selectedFlair, onSelectFlair, newFlair, onNewFlairChange }) => (
    
    <div>
        <label htmlFor="flair-select">Select Link Flair (optional):</label>
        <select id="flair-select" value={selectedFlair || ""} 
        onChange={e => {const selected = linkFlairs.find(flair => flair._id === e.target.value);
            onSelectFlair(selected._id || "")}}>

            <option value="">None</option>
            {linkFlairs.map(linkFlair => (
                <option key={linkFlair._id} value={linkFlair._id}>
                    {linkFlair.content}
                </option>
            ))}
        </select>

        <div>
            <label htmlFor="new-flair">Or Create New Link Flair:</label>
            <input
                type="text"
                id="new-flair"
                maxLength="30"
                value={newFlair}
                placeholder="Enter new flair (optional)"
                onChange={e => onNewFlairChange(e.target.value)}
            />
        </div>
    </div>
);

export default LinkFlair;