const express = require('express');
const { createMessage, getMessages, deleteMessage } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new message (protected route)
router.post('/', authMiddleware, createMessage);

// Get messages between two users (protected route)
router.get('/:userId', authMiddleware, getMessages);

// Delete a message (protected route)
router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;
