// models/communities.js
const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  postIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  startDate: { type: Date, default: Date.now },
  members: [{ type: String, required: true }],
  createdBy: {type: String}
});

module.exports = mongoose.model('Community', CommunitySchema);
