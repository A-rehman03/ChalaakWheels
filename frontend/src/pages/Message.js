import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';  // Import socket.io-client

const socket = io('http://localhost:5000');  // Connect to the server's socket

const Message = ({ user, sellerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receive_message', (messageData) => {
      if (messageData.receiverId === user._id || messageData.senderId === user._id) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    });

    return () => {
      // Cleanup when component unmounts
      socket.off('receive_message');
    };
  }, [user._id]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        senderId: user._id,
        receiverId: sellerId,
        message: newMessage,
      };

      // Emit the message event
      socket.emit('send_message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);  // Update local message list
      setNewMessage('');  // Clear input field
    }
  };

  return (
    <div>
      <h2>Messages with Seller</h2>
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === user._id ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="message-input">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Message;
