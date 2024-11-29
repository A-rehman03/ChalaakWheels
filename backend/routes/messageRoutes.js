const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createConversation, sendMessage, getMessages } = require('../controllers/messageController');

router.post('/conversations', authMiddleware, createConversation);
router.post('/messages', authMiddleware, sendMessage);
router.get('/messages/:conversationId', authMiddleware, getMessages);

module.exports = router;
