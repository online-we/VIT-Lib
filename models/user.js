// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

// Pre-save hook to hash the password before saving it to the database
UserSchema.pre('save', async function (next) {
    const user = this;

    // Only hash the password if it has been modified or if it's new
    if (!user.isModified('password')) return next();

    try {
        // Generate a salt with 10 rounds
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the generated salt
        const hash = await bcrypt.hash(user.password, salt);
        // Replace the plain password with the hashed one
        user.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare candidate password with the hashed password in the database
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);