// server.js

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Import User model
const User = require('./modules/User');

// Define routes

// GET: Return all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Add a new user to the database
app.post('/users', async (req, res) => {
    const user = new User({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Edit a user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.name != null) {
            user.name = req.body.name;
        }
        if (req.body.age != null) {
            user.age = req.body.age;
        }
        if (req.body.email != null) {
            user.email = req.body.email;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Remove a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
