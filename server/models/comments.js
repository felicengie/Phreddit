// models/comments.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true, maxlength: 500 },
  commentIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdBy: { type: String, required: true},
  commentedDate: { type: Date, default: Date.now },
  upvoters: [{type: String}],
  downvoters: [{type: String}]
});

module.exports = mongoose.model('Comment', CommentSchema);
