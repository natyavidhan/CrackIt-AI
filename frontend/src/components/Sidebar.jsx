import React from 'react';

const Sidebar = ({ chats, currentChatId, setCurrentChatId, createNewChat, deleteChat }) => {
  return (
    <div className="w-64 h-full flex flex-col bg-gray-800 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <button 
          onClick={() => createNewChat('General', 'General')}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-gray-400 text-center">
            No chats yet. Start a new conversation!
          </div>
        ) : (
          <ul>
            {chats.map(chat => (
              <li 
                key={chat.id}
                className={`
                  flex justify-between items-center px-4 py-3 cursor-pointer
                  ${currentChatId === chat.id ? 'bg-gray-700' : 'hover:bg-gray-700'}
                `}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <div className="truncate flex-1">
                  <span className="block text-sm font-medium">{chat.title}</span>
                  <span className="block text-xs text-gray-400">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="text-gray-400 hover:text-red-400 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="p-4 text-xs text-gray-500 border-t border-gray-700">
        © 2025 Chat App
      </div>
    </div>
  );
};

export default Sidebar;