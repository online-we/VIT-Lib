// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Ensure you have this model created

require('dotenv').config(); // Load environment variables
const app = express();
const port = 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Your secret key from environment variables
const secretKey = process.env.JWT_SECRET || 'default_secret'; // Use environment variable for security

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

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Hashed Password:', hashedPassword); // Log the hashed password

    // Create a new user
    const newUser = new User({
        username,
        password: hashedPassword
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

    console.log(`Login attempt with username: ${username} and password: ${password}`);

    // Find the user by username
    try {
        const user = await User.findOne({ username });
        console.log(user); // Log the user data
        console.log('Entered Password:', password);

        if (!user) {
            console.log("User not found");
            return res.status(400).json({ msg: 'User not found' });
        }

        console.log('Stored Hashed Password:', user.password); // Log the stored hashed password
        
        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Server error' });
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
