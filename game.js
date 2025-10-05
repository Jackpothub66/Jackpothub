const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
title: { type: String, required: true },
type: { type: String, required: true }, // skill, lucky, tournament
bet: { type: Number, required: true },
img: { type: String, required: true }
});
module.exports = mongoose.model('Game', gameSchema);