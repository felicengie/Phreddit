import React, {useState, useEffect} from 'react';
import { UsePhredditContext } from '../phredditContext';

const CommunitySelect = ({ communities = [], onSelect }) => {
    const {user, selectedPost} = UsePhredditContext()
    const [selectedCommunity, setSelectedCommunity] = useState("");

     useEffect(() => {
        if (selectedPost) {
            // Find the community that contains the selectedPost
            const communityWithPost = communities.find(community =>
                community.postIDs.includes(selectedPost._id)
            );
            setSelectedCommunity(communityWithPost ? communityWithPost._id : "");
        }
    }, [selectedPost, communities]);

    // Sort communities: Communities where the user is a member come first
    const sortedCommunities = [...communities].sort((a, b) => {
        const isMemberA = a.members.includes(user.displayName);
        const isMemberB = b.members.includes(user.displayName);
        return isMemberB - isMemberA; 
    });

    const handleChange = (value) => {
        setSelectedCommunity(value); // Update local state
        onSelect(value); // Notify the parent component of the change
    };

    return(
    <div>
        <label htmlFor="community-select">Select Community: <span className="required" style={{ color: 'red' }}>*</span></label>
        <select id="community-select" value= {selectedCommunity} onChange={(e) => handleChange(e.target.value)}>
            <option value="">-- Select a Community --</option>
            {sortedCommunities.map(community => (
                <option key={community._id} value={community._id}>
                    {community.name}
                </option>
            ))}
        </select>
    </div>
)};

export default CommunitySelect;