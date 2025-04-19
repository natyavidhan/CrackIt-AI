import React from 'react';
import './Sidebar.css'; 

const Sidebar = ({ chats, currentChatId, setCurrentChatId, createNewChat, deleteChat, renameChat }) => {

  const handleNewChatClick = () => {
    const chatName = prompt("Enter a name for the new chat:");
    if (chatName && chatName.trim()) { 
      createNewChat(chatName.trim());
    } else if (chatName !== null) { 
        alert("Chat name cannot be empty.");
    }
    
  };

  const handleRenameClick = (e, chatId, currentTitle) => {
    e.stopPropagation(); 
    const newName = prompt("Enter a new name for the chat:", currentTitle);
    if (newName !== null) { 
        renameChat(chatId, newName);
    }
  };

  return (
    <div className="sidebar-container"> 
      <div className="sidebar-header"> 
        <button
          onClick={handleNewChatClick} 
          className="new-chat-button" 
        >
          New Chat
        </button>
      </div>

      <div className="chat-list-container"> 
        {chats.length === 0 ? (
          <div className="no-chats-message"> 
            No chats yet. Start a new conversation!
          </div>
        ) : (
          <ul className="chat-list"> 
            {chats.map(chat => (
              <li
                key={chat.id}
                className={`chat-list-item ${currentChatId === chat.id ? 'active' : ''}`} 
                onClick={() => setCurrentChatId(chat.id)}
              >
                <div className="chat-item-info"> 
                  <span className="chat-item-title">{chat.title}</span> 
                  <span className="chat-item-date"> 
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="chat-item-actions"> 
                  <button
                    onClick={(e) => handleRenameClick(e, chat.id, chat.title)}
                    className="rename-chat-button" 
                    title="Rename chat" 
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="delete-chat-button" 
                    title="Delete chat" 
                  >
                    <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-footer"> 
        © 2025 Chat App
      </div>
    </div>
  );
};

export default Sidebar;