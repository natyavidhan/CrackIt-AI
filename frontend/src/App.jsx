// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';

function App() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const isInitialMount = useRef(true); // Ref to track initial mount

  // Load chats from localStorage on initial render
  useEffect(() => {
    console.log("Attempting to load chats from localStorage...");
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        console.log("Loaded chats:", parsedChats);
        // Basic validation: ensure it's an array
        if (Array.isArray(parsedChats)) {
          setChats(parsedChats);
          // Set the most recent chat as current if available
          if (parsedChats.length > 0) {
            // Ensure the first chat has an ID before setting it
            if (parsedChats[0] && parsedChats[0].id) {
              setCurrentChatId(parsedChats[0].id);
              console.log("Set current chat ID to:", parsedChats[0].id);
            } else {
              console.warn("First loaded chat is missing an ID.");
            }
          }
        } else {
          console.warn("Invalid data found in localStorage for 'chats'. Expected an array.");
          localStorage.removeItem('chats'); // Clear invalid data
        }
      } catch (error) {
        console.error("Failed to parse chats from localStorage:", error);
        localStorage.removeItem('chats'); // Clear corrupted data
      }
    } else {
      console.log("No chats found in localStorage.");
    }
  }, []);

  // Save chats to localStorage whenever they change, *after* initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      // Skip saving on the very first render cycle
      isInitialMount.current = false;
      console.log("Initial mount: Skipping save to localStorage.");
    } else {
      // Only save after the initial load effect has potentially run
      console.log("Saving chats to localStorage:", chats);
      try {
        localStorage.setItem('chats', JSON.stringify(chats));
      } catch (error) {
        console.error("Failed to save chats to localStorage:", error);
      }
    }
  }, [chats]);

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === currentChatId) || null;
  };

  const createNewChat = (exam, subject) => {
    const newChat = {
      id: Date.now().toString(),
      title: `${exam} - ${subject}`,
      exam,
      subject,
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const deleteChat = (chatId) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    if (currentChatId === chatId && updatedChats.length > 0) {
      setCurrentChatId(updatedChats[0].id);
    } else if (updatedChats.length === 0) {
      setCurrentChatId(null);
    }
  };

  const sendMessage = async (message, exam, subject) => {
    let chatId = currentChatId;
    
    // If no current chat, create a new one
    if (!chatId) {
      chatId = createNewChat(exam, subject);
    }
    
    // Add user message
    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };
    
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );
    
    // Simulate AI response (replace with real API call)
    setLoading(true);
    
    setTimeout(() => {
      const aiResponse = { 
        role: 'assistant', 
        content: `This is a simulated response for your question about ${exam} - ${subject}: "${message}"`, 
        timestamp: new Date().toISOString() 
      };
      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? { ...chat, messages: [...chat.messages, aiResponse] }
            : chat
        )
      );
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <Sidebar 
        chats={chats} 
        currentChatId={currentChatId} 
        setCurrentChatId={setCurrentChatId}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
      />
      
      <div className="flex flex-col flex-1 h-full">
        <ChatArea 
          currentChat={getCurrentChat()} 
          loading={loading}
        />
        
        <InputArea 
          sendMessage={sendMessage}
          disabled={loading}
        />
      </div>
    </div>
  );
}

export default App;