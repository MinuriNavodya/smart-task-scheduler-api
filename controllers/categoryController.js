const Category = require('../models/Category');
const Task     = require('../models/Task');

// ─────────────────────────────────────────────────────────
// @desc    Get all categories for logged-in user
// @route   GET /api/categories
// @access  Private
// ─────────────────────────────────────────────────────────
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id }).sort({ createdAt: -1 });

        if (categories.length === 0) {
            return res.status(404).json({ message: "Categories not found!" });
        }

        res.status(200).json(categories);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
// ─────────────────────────────────────────────────────────
const createCategory = async (req, res) => {
    try {
        const { name, color, icon } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required." });
        }

        // Check if category with same name already exists for this user
        const categoryExist = await Category.findOne({ name, user: req.user.id });
        if (categoryExist) {
            return res.status(400).json({ message: "Category already exists!" });
        }

        const category = await Category.create({
            name,
            color: color || '#6366f1',
            icon:  icon  || '📁',
            user:  req.user.id
        });

        res.status(201).json(category);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
// ─────────────────────────────────────────────────────────
const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;

        const categoryExist = await Category.findOne({ _id: id, user: req.user.id });
        if (!categoryExist) {
            return res.status(404).json({ message: "Category not found!" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedCategory);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ─────────────────────────────────────────────────────────
// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
// ─────────────────────────────────────────────────────────
const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;

        const categoryExist = await Category.findOne({ _id: id, user: req.user.id });
        if (!categoryExist) {
            return res.status(404).json({ message: "Category not found!" });
        }

        await Category.findByIdAndDelete(id);

        // Unlink tasks that belonged to this category
        await Task.updateMany({ category: id }, { $set: { category: null } });

        res.status(200).json({ message: "Category deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
