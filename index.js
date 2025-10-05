require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// मॉडल्स इम्पोर्ट करें
const User = require('../models/user');
const Game = require('../models/game');
const Transaction = require('../models/transaction');

const app = express();

// मिडलवेयर
app.use(cors());
app.use(express.json());

// --- Mongoose/MongoDB कनेक्शन ---
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  const db = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  cachedDb = db;
  return db;
}

app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        res.status(500).json({ error: "Database connection failed" });
    }
});

// --- API ROUTES ---

// AUTH
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });
        
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        if (user.status === 'banned') return res.status(403).json({ error: 'Account is banned' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// GAMES
app.get('/api/games', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch games' });
    }
});

// USER & WALLET
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const transactions = await Transaction.find({ userId: req.params.id }).sort({ date: -1 }).limit(10);
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            wallet: user.wallet,
            status: user.status,
            memberSince: user.memberSince
        };
        res.json({ user: userData, transactions });
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch user data' });
    }
});

app.post('/api/play/:gameId', async (req, res) => {
    const { userId } = req.body;
    try {
        const game = await Game.findById(req.params.gameId);
        const user = await User.findById(userId);

        if (user.wallet < game.bet) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        user.wallet -= game.bet;
        const betTx = new Transaction({ userId, type: 'bet', amount: -game.bet, status: 'success' });
        
        const isWin = Math.random() < 0.3;
        let winnings = 0;
        if (isWin) {
            winnings = game.bet * (Math.floor(Math.random() * 3) + 2);
            user.wallet += winnings;
            const winTx = new Transaction({ userId, type: 'win', amount: winnings, status: 'success' });
            await winTx.save();
        }

        await betTx.save();
        await user.save();
        res.json({ outcome: isWin ? 'win' : 'loss', winnings, newBalance: user.wallet });
    } catch (error) {
        res.status(500).json({ error: 'Game play failed' });
    }
});

// ADMIN ROUTES
app.get('/api/admin/users', async (req,res) => {
    try {
        const users = await User.find().select('-password'); // पासवर्ड न भेजें
        res.json(users);
    } catch(error){
        res.status(500).json({error: 'Failed to fetch users'});
    }
});

app.put('/api/admin/user/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

module.exports = app;