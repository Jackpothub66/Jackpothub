const express = require('express');
const router = express.Router();

// मॉडल्स इम्पोर्ट करें
const User = require('../models/user');
const Game = require('../models/game');
const Transaction = require('../models/transaction');

// --- AUTH ROUTES ---
// POST /api/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // नोट: यहाँ पासवर्ड हैशिंग (bcrypt.js का उपयोग करके) जोड़ें
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }); // नोट: पासवर्ड तुलना हैश के साथ करें
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// --- GAME ROUTES ---
// GET /api/games
router.get('/games', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch games' });
    }
});

// --- USER & WALLET ROUTES ---
// GET /api/user/:id
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const transactions = await Transaction.find({ userId: req.params.id }).sort({ date: -1 }).limit(5);
        res.json({ user, transactions });
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch user data' });
    }
});

// POST /api/play/:gameId
router.post('/play/:gameId', async (req, res) => {
    const { userId } = req.body;
    try {
        const game = await Game.findById(req.params.gameId);
        const user = await User.findById(userId);

        if (user.wallet < game.bet) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        user.wallet -= game.bet;
        // यहाँ गेम लॉजिक चलाएं और जीत/हार का निर्धारण करें
        // उदाहरण के लिए, 30% जीतने का मौका
        const isWin = Math.random() < 0.3;
        let winnings = 0;
        if (isWin) {
            winnings = game.bet * 2; // उदाहरण: 2x जीत
            user.wallet += winnings;
            const winTx = new Transaction({ userId, type: 'win', amount: winnings });
            await winTx.save();
        }

        await user.save();
        res.json({ outcome: isWin ? 'win' : 'loss', winnings, newBalance: user.wallet });
    } catch (error) {
        res.status(500).json({ error: 'Game play failed' });
    }
});


// (यहाँ अन्य एडमिन और यूजर रूट्स जोड़ें, जैसे लेन-देन, लीडरबोर्ड आदि)

module.exports = router;