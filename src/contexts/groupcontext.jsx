import React, { createContext, useState, useContext } from 'react';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    { id: 1, content: 'Welcome to the group!', pinned: false, user: 'Admin' },
    { id: 2, content: 'Please follow the group rules.', pinned: false, user: 'Admin' },
  ]);
  const [members, setMembers] = useState([
    { id: 1, name: 'John', isAdmin: true },
    { id: 2, name: 'Jane', isAdmin: false },
  ]);
  const [polls, setPolls] = useState([]);
  const [insights, setInsights] = useState({ activeUsers: 10, messagesPerDay: 5 });

  const togglePinMessage = (id) => {
    setMessages(messages.map(msg => msg.id === id ? { ...msg, pinned: !msg.pinned } : msg));
  };

  return (
    <GroupContext.Provider value={{
      messages,
      setMessages,
      togglePinMessage,
      members,
      setMembers,
      polls,
      setPolls,
      insights,
      setInsights,
    }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);
