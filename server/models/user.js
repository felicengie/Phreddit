const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {type:String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    displayName: {type: String, required: true, unique: true},
    password: { type: String, required: true }, // Remember to hash passwords
    dateJoined: { type: Date, default: Date.now },
    reputation: {type: Number, default: 100},
    role:{type: String, required: true, default: "user"}
});

module.exports = mongoose.model('User', UserSchema);
