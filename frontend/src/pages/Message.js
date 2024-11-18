import React, { useState, useEffect } from 'react';
import { getMessages, sendMessage, createConversation } from '../services/api';
import { useParams } from 'react-router-dom';

const Messaging = ({ user, token }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data: conversation } = await createConversation(userId, token);
        const { data: messages } = await getMessages(conversation._id, token);
        setMessages(messages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    loadMessages();
  }, [userId, token]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const { data: message } = await sendMessage(messages[0].conversationId, text, token);
      setMessages([...messages, message]);
      setText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  return (
    <div className="messaging">
      <div className="message-list">
        {messages.map((msg) => (
          <div key={msg._id} className={msg.senderId === user._id ? 'my-message' : 'their-message'}>
            <p>{msg.text}</p>
            <small>{msg.senderId === user._id ? 'You' : msg.senderId.username}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messaging;
