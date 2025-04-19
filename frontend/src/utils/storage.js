// src/utils/storage.js

const saveChatData = (chat) => {
    const storedChats = JSON.parse(localStorage.getItem('chats')) || [];
    storedChats.push(chat);
    localStorage.setItem('chats', JSON.stringify(storedChats));
  };
  
  const getSavedChats = () => {
    return JSON.parse(localStorage.getItem('chats')) || [];
  };
  
  export { saveChatData, getSavedChats };
  