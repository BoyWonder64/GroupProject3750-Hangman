import React, { useState, useEffect } from 'react';

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...');
      const response = await fetch('http://localhost:5000/hangman');
      console.log('Response:', response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div>
      <p>This is the Hangman page</p>
    </div>
  );
};

export default MessageList;