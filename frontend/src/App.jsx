// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios
import './App.css'; // Import App.css
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

  // Modify createNewChat to accept a title
  const createNewChat = (title) => {
    // If no title is provided (e.g., user cancelled prompt), do nothing
    if (!title) return null;

    const newChat = {
      id: Date.now().toString(),
      title: title.trim(), // Use the provided title
      exam: 'Custom', // Set exam/subject to 'Custom' or similar
      subject: 'Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };

    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    return newChat.id; // Return the id as before
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

  // Function to rename a chat
  const renameChat = (chatId, newTitle) => {
    if (!newTitle || !newTitle.trim()) {
      alert("Chat name cannot be empty.");
      return;
    }
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, title: newTitle.trim() }
          : chat
      )
    );
  };

  const sendMessage = async (message, examId, subjectId) => {
    let chatId = currentChatId;

    if (!chatId) {
       console.warn("No active chat selected. Please select or create a chat.");
       alert("Please select or create a chat first.");
       return;
    }

    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };

    // Add user message optimistically
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    setLoading(true);

    try {
      // Make API call to backend
      const response = await axios.post('/api/ask', { // Use relative path with proxy
        query: message,
        exam_id: examId,
        subject_id: subjectId,
        top_k: 3 // Or make this configurable if needed
      });

      const aiResponse = {
        role: 'assistant',
        content: response.data.answer,
        context_used: response.data.context_used, // Store context
        timestamp: new Date().toISOString()
      };

      // Add AI response
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, aiResponse] }
            : chat
        )
      );

    } catch (error) {
      console.error("Error fetching AI response:", error);
      // Add an error message to the chat
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error. ${error.response?.data?.detail || error.message || ''}`,
        timestamp: new Date().toISOString(),
        isError: true // Add a flag for styling if needed
      };
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container"> {/* Replaced Tailwind classes */}
      <Sidebar 
        chats={chats} 
        currentChatId={currentChatId} 
        setCurrentChatId={setCurrentChatId}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        renameChat={renameChat} // Pass renameChat down
      />
      
      <div className="main-content"> {/* Replaced Tailwind classes */}
        <ChatArea 
          currentChat={getCurrentChat()} 
          loading={loading}
        />
        
        <InputArea 
          sendMessage={sendMessage}
          disabled={loading || !currentChatId} // Also disable if no chat is selected
        />
      </div>
    </div>
  );
}

export default App;