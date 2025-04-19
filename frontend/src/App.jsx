// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
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

  const sendMessage = async (message, exam, subject) => {
    let chatId = currentChatId;

    // If no current chat, create a new one using the selected exam/subject
    // This part needs adjustment if we want the *first* message to define the chat
    // For now, let's assume a chat must exist or be created via the sidebar button first.
    // OR: We could prompt here too if no chat exists. Let's stick to the sidebar prompt for now.
    if (!chatId) {
       // Option 1: Don't create a chat here, force user to use sidebar button first.
       console.warn("No active chat selected. Please select or create a chat.");
       setLoading(false); // Ensure loading state is reset if we abort
       return;
       // Option 2: Create a default chat (less ideal now)
       // chatId = createNewChat(`${exam} - ${subject}`); // This would use the modified createNewChat
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

    // Find the current chat details to potentially pass to API
    const currentChatDetails = chats.find(chat => chat.id === chatId);
    const currentExam = currentChatDetails ? currentChatDetails.exam : exam; // Use chat's exam/subject if available
    const currentSubject = currentChatDetails ? currentChatDetails.subject : subject;

    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: `This is a simulated response for your question about ${currentExam} - ${currentSubject}: "${message}"`,
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
          disabled={loading}
        />
      </div>
    </div>
  );
}

export default App;