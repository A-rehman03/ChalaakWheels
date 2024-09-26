const Message = require('../models/Message');

// Create a new message
const createMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;

    const newMessage = new Message({
      sender: req.user.id, // Get user ID from auth middleware
      receiver,
      content,
    });

    const message = await newMessage.save();
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    }).populate('sender', 'name').populate('receiver', 'name');

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    // Check if the user deleting is the sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await message.remove();
    res.json({ msg: 'Message removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createMessage,
  getMessages,
  deleteMessage,
};
