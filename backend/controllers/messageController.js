const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

exports.createConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    const existingConversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] },
    });

    const conversation = existingConversation || await Conversation.create({
      participants: [req.user._id, userId],
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation.' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'username')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};
