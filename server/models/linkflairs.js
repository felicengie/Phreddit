// models/linkflairs.js
const mongoose = require('mongoose');

const LinkFlairSchema = new mongoose.Schema({
  linkFlairID: { type: String, required: false}, // Added linkFlairID
  content: { type: String, required: true },     // Added content
});


module.exports = mongoose.model('LinkFlair', LinkFlairSchema);
