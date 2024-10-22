// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); 

require('dotenv').config(); // Load environment variables
const app = express();
const port = 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

const secretKey = 'anshi' ; // Use environment variable for security

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    console.log('Registering User Password:', password); // Log the plain password

    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    // Create a new user
    const newUser = new User({
        username,
        password: password
    });

    try {
        await newUser.save();
        console.log('User saved to DB:', newUser); // Log the saved user object for confirmation
        
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error('Error saving user:', err); // Log any errors
        
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log(Login attempt with username: ${username} and password: ${password});

    // Find the user by username
    try {
        const user = await User.findOne({ username });
        console.log(user); // Log the user data
        console.log('Entered Password:', password);

        if (!user) {
            console.log("Ivalid user or password");
            return res.status(401).json({ msg: 'Ivalid user or password' });
        }

        console.log('Stored Password:', user.password); // Log the stored password
        
        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'anshi', { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
    res.json({ msg: 'This is a protected route', user: req.user });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the Authorization header

    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
}

// Start server
app.listen(port, () => console.log(Server running on port ${port}));