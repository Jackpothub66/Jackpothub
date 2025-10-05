require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// मिडलवेयर
app.use(cors());
app.use(express.json()); // JSON बॉडीज को पार्स करने के लिए
app.use(express.static(path.join(__dirname, 'public'))); // स्टैटिक फाइलों (HTML) को सर्व करने के लिए

// डेटाबेस कनेक्शन
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// API रूट्स
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// सर्वर प्रारंभ करें
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});