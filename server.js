const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database Connection ────────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log("Database connection error:", error);
    });

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/tasks',      require('./routes/taskRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// ── Health Check ───────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ message: "Task Manager API is running 🚀" });
});

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// ── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
