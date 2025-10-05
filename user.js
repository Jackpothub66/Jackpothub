const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // नोट: वास्तविक ऐप में पासवर्ड को हैश करें!
    wallet: { type: Number, default: 0 },
    status: { type: String, default: 'active' }, // active, banned
    memberSince: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);