import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTimes, FaComments } from 'react-icons/fa';

const ChatPanel = ({ isOpen, onToggle, socket, roomId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && isOpen) {
      // Listen for chat messages
      socket.on('chat-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for typing indicators
      socket.on('typing', (data) => {
        // Handle typing indicators if needed
      });

      return () => {
        socket.off('chat-message');
        socket.off('typing');
      };
    }
  }, [socket, isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        text: newMessage.trim(),
        sender: userType,
        timestamp: new Date().toISOString(),
        roomId
      };

      socket.emit('chat-message', messageData);
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-40"
        title="Open Chat"
      >
        <FaComments className="text-xl" />
        {messages.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {messages.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Chat</h3>
        <button
          onClick={onToggle}
          className="hover:bg-blue-600 p-1 rounded transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <FaComments className="text-3xl mx-auto mb-2 opacity-50" />
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === userType ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.sender === userType
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <span className={`text-xs ${message.sender === userType ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;