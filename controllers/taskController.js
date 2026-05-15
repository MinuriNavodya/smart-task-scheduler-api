const mongoose = require('mongoose');
const Task     = require('../models/Task');

// ─────────────────────────────────────────────────────────
// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
// ─────────────────────────────────────────────────────────
const getAllTasks = async (req, res) => {
    try {
        const { status, priority, search } = req.query;

        // Build filter – always scoped to logged-in user
        const filter = { user: req.user.id };
        if (status)   filter.status   = status;
        if (priority) filter.priority = priority;
        if (search) {
            filter.$or = [
                { title:       { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(filter)
            .populate('category', 'name color icon')
            .sort({ createdAt: -1 });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "Tasks not found!" });
        }

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
// ─────────────────────────────────────────────────────────
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
            .populate('category', 'name color icon');

        if (!task) {
            return res.status(404).json({ message: "Task not found!" });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Get upcoming tasks (due in the next 7 days)
// @route   GET /api/tasks/upcoming
// @access  Private
// ─────────────────────────────────────────────────────────
const getUpcomingTasks = async (req, res) => {
    try {
        const today    = new Date();
        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7);

        const tasks = await Task.find({
            user:    req.user.id,
            dueDate: { $gte: today, $lte: next7Days },
            status:  { $ne: 'completed' }
        }).populate('category', 'name color icon');

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No upcoming tasks found!" });
        }

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Get task statistics for logged-in user
// @route   GET /api/tasks/stats
// @access  Private
// ─────────────────────────────────────────────────────────
const getTaskStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const total = await Task.countDocuments({ user: userId });

        const statusCounts = await Task.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const overdue = await Task.countDocuments({
            user:    userId,
            dueDate: { $lt: new Date() },
            status:  { $nin: ['completed', 'cancelled'] }
        });

        const byStatus = {};
        ['todo', 'in-progress', 'completed', 'cancelled'].forEach((s) => {
            byStatus[s] = statusCounts.find((x) => x._id === s)?.count || 0;
        });

        const completionRate = total > 0
            ? Math.round((byStatus.completed / total) * 100)
            : 0;

        res.status(200).json({ total, byStatus, overdue, completionRate });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
// ─────────────────────────────────────────────────────────
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, tags, category } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        // Check if task with same title already exists for this user
        const taskExist = await Task.findOne({ title, user: req.user.id });
        if (taskExist) {
            return res.status(400).json({ message: "Task already exists!" });
        }

        const task = await Task.create({
            title,
            description,
            status:   status   || 'todo',
            priority: priority || 'medium',
            dueDate:  dueDate  || null,
            tags:     tags     || [],
            category: category || null,
            user:     req.user.id
        });

        await task.populate('category', 'name color icon');

        res.status(201).json(task);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
// ─────────────────────────────────────────────────────────
const updateTask = async (req, res) => {
    try {
        const id = req.params.id;

        const taskExist = await Task.findOne({ _id: id, user: req.user.id });
        if (!taskExist) {
            return res.status(404).json({ message: "Task not found!" });
        }

        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true })
            .populate('category', 'name color icon');

        res.status(200).json(updatedTask);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
// ─────────────────────────────────────────────────────────
const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;

        const taskExist = await Task.findOne({ _id: id, user: req.user.id });
        if (!taskExist) {
            return res.status(404).json({ message: "Task not found!" });
        }

        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: "Task deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getAllTasks, getTaskById, getUpcomingTasks, getTaskStats, createTask, updateTask, deleteTask };
