import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';

function App() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        if (Array.isArray(parsedChats)) {
          setChats(parsedChats);
          if (parsedChats.length > 0) {
            if (parsedChats[0] && parsedChats[0].id) {
              setCurrentChatId(parsedChats[0].id);
            }
          }
        } else {
          localStorage.removeItem('chats');
        }
      } catch (error) {
        localStorage.removeItem('chats');
      }
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      try {
        localStorage.setItem('chats', JSON.stringify(chats));
      } catch (error) {}
    }
  }, [chats]);

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === currentChatId) || null;
  };

  const createNewChat = (title) => {
    if (!title) return null;

    const newChat = {
      id: Date.now().toString(),
      title: title.trim(),
      exam: 'Custom',
      subject: 'Chat',
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
      alert("Please select or create a chat first.");
      return;
    }

    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    setLoading(true);

    try {
      const response = await axios.post('/api/ask', {
        query: message,
        exam_id: examId,
        subject_id: subjectId,
        top_k: 3
      });

      const aiResponse = {
        role: 'assistant',
        content: response.data.answer,
        context_used: response.data.context_used,
        timestamp: new Date().toISOString()
      };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, aiResponse] }
            : chat
        )
      );

    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error. ${error.response?.data?.detail || error.message || ''}`,
        timestamp: new Date().toISOString(),
        isError: true
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
    <div className="app-container">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        renameChat={renameChat}
      />

      <div className="main-content">
        <ChatArea
          currentChat={getCurrentChat()}
          loading={loading}
        />

        <InputArea
          sendMessage={sendMessage}
          disabled={loading || !currentChatId}
        />
      </div>
    </div>
  );
}

export default App;