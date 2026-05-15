const User = require('../models/User');
const jwt  = require('jsonwebtoken');

// Helper – generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || '7d'
    });
};

// ─────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check all fields provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Create and save user (password hashed by model pre-save hook)
        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            message: "User registered successfully!",
            token,
            user: {
                id:    user._id,
                name:  user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Login user and return token
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check all fields provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Find user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Compare password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id:    user._id,
                name:  user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Update logged-in user name
// @route   PUT /api/auth/profile
// @access  Private
// ─────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Profile updated successfully!",
            user: {
                id:    user._id,
                name:  user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { register, login, getMe, updateProfile };
