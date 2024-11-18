import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Image, X, MoreVertical } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Chat = ({ phoneNumber }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Sample initial data - replace with actual API calls
  const sampleChats = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      timestamp: "10:30 AM",
      unread: 2,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Marketing Group",
      lastMessage: "Meeting at 3 PM",
      timestamp: "9:45 AM",
      unread: 0,
      isGroup: true,
      avatar: "/api/placeholder/40/40"
    }
  ];

  const sampleMessages = [
    {
      id: 1,
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
      sender: "John Doe",
      isSent: true
    },
    {
      id: 2,
      content: "I'm good, thanks! How about you?",
      timestamp: "10:31 AM",
      sender: "me",
      isSent: false
    }
  ];

  useEffect(() => {
    // Simulate fetching chats
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        // const response = await fetch('/api/whatsapp/chats');
        // const data = await response.json();
        setTimeout(() => {
          setChats(sampleChats);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setError("Failed to load chats");
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
      isSent: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setMessages(sampleMessages); // Replace with actual message fetch
  };

  const ChatList = () => (
    <div className="w-full md:w-80 border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <div className="overflow-y-auto h-[calc(100vh-12rem)]">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatSelect(chat)}
            className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
              selectedChat?.id === chat.id ? 'bg-gray-50' : ''
            }`}
          >
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <h3 className="text-sm font-semibold">{chat.name}</h3>
                <span className="text-xs text-gray-500">{chat.timestamp}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatMessages = () => (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        {selectedChat && (
          <>
            <div className="flex items-center">
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <h3 className="font-semibold">{selectedChat.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedChat.isGroup ? "Group" : "Online"}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'me' ? 'justify-end' : 'justify-start'
            } mb-4`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender === 'me'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Smile className="w-5 h-5 text-gray-500" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="p-2 bg-green-500 hover:bg-green-600 rounded-full text-white"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4 bg-red-50 border-red-200">
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-white rounded-lg shadow-sm">
      <ChatList />
      {selectedChat ? (
        <ChatMessages />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">Welcome to WhatsApp Web</h3>
            <p className="text-gray-500 mt-2">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;