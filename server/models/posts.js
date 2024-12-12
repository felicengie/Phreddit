const mongoose = require('mongoose');

// Define the Post schema
const PostSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 100 },
    content: { type: String },
    linkFlairID: { type: mongoose.Schema.Types.ObjectId, ref: 'LinkFlair' },
    createdBy: { type: String, required: true },
    postedDate: { type: Date, default: Date.now },
    commentIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    views: { type: Number, default: 0 },
    upvoters: [{type: String}],
    downvoters: [{type: String}],
});

module.exports = mongoose.model('Post', PostSchema);
