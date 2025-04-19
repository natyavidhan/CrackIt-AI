import React, { useEffect, useRef } from 'react';

const ChatArea = ({ currentChat, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 p-6 overflow-y-auto">
        <div className="text-center text-gray-400">
          <h3 className="text-xl font-medium mb-2">Welcome to Chat App</h3>
          <p>Select a chat from the sidebar or start a new conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="sticky top-0 mb-4 py-2 bg-gray-900 z-10">
          <h2 className="text-xl font-medium">{currentChat.title}</h2>
        </div>

        {currentChat.messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p>Start the conversation by sending a message</p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentChat.messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-md p-4 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  {message.content}
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-md p-4 rounded-lg bg-gray-800 text-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;