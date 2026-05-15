const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        // Check for token in Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Not authorized. No token provided." });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request (excluding password)
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Not authorized. User not found." });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Not authorized. Token is invalid or expired." });
    }
};

module.exports = protect;
