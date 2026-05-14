const express  = require('express');
const router   = express.Router();
const protect  = require('../middleware/authMiddleware');
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// All category routes are private
router.use(protect);

router.get('/',       getAllCategories);   // GET    /api/categories
router.post('/',      createCategory);    // POST   /api/categories
router.put('/:id',    updateCategory);    // PUT    /api/categories/:id
router.delete('/:id', deleteCategory);   // DELETE /api/categories/:id

module.exports = router;
