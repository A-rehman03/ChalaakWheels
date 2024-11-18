// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/user', authMiddleware, async (req, res) => {
    try {
      const messages = await Message.find({ recipientId: req.user.id });
      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch messages.' });
    }
  });

// Send a message
router.post('/', authMiddleware, async (req, res) => {
    const { recipient, content, carListing } = req.body;
    const sender = req.user.id;

    try {
        const message = new Message({ sender, recipient, content, carListing });
        await message.save();
        res.status(201).json({ message: 'Message sent successfully', message });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get messages for a specific user
router.get('/:recipientId', authMiddleware, async (req, res) => {
    const { recipientId } = req.params;

    try {
        const messages = await Message.find({
            $or: [{ sender: recipientId }, { recipient: recipientId }],
        })
            .populate('sender', 'name')
            .populate('recipient', 'name')
            .sort({ timestamp: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

module.exports = router;
