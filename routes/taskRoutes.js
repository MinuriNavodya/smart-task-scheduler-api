const express  = require('express');
const router   = express.Router();
const protect  = require('../middleware/authMiddleware');
const {
    getAllTasks,
    getTaskById,
    getUpcomingTasks,
    getTaskStats,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

// All task routes are private
router.use(protect);

router.get('/upcoming', getUpcomingTasks);   // GET /api/tasks/upcoming
router.get('/stats',    getTaskStats);       // GET /api/tasks/stats
router.get('/',         getAllTasks);        // GET /api/tasks
router.get('/:id',      getTaskById);       // GET /api/tasks/:id
router.post('/',        createTask);        // POST /api/tasks
router.put('/:id',      updateTask);        // PUT /api/tasks/:id
router.delete('/:id',   deleteTask);       // DELETE /api/tasks/:id

module.exports = router;
