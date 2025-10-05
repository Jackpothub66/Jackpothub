const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // deposit, withdraw, win, bet
    amount: { type: Number, required: true },
    status: { type: String, default: 'success' }, // success, pending, failed
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);