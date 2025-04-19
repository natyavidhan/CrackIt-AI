import React, { useEffect, useRef } from "react";
import './ChatArea.css'; // Import ChatArea.css

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
            <div className="chat-area-container chat-area-welcome"> 
                <div className="welcome-message"> 
                <h3>Welcome to Chat App</h3> 
                <p>Select a chat from the sidebar or start a new conversation</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-area-container"> 
        <div className="chat-area-content"> 
            <div className="chat-header"> 
            <h2 className="chat-title">{currentChat.title}</h2> 
            </div>

            {currentChat.messages.length === 0 ? (
            <div className="empty-chat-message"> 
                <p>Start the conversation by sending a message</p>
            </div>
            ) : (
            <div className="messages-list"> 
                {currentChat.messages.map((message, index) => (
                <div
                    key={index}
                    className={`message-row ${message.role}`} // Replaced Tailwind
                >
                    <div
                    className={`message-bubble ${message.role}`} // Replaced Tailwind
                    >
                    {message.content}
                    <div className="message-timestamp"> 
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                    </div>
                </div>
                ))}

                {loading && (
                <div className="loading-indicator"> 
                    <div className="loading-bubble"> 
                    <div className="loading-dots"> 
                        <div className="loading-dot"></div> 
                        <div className="loading-dot"></div> 
                        <div className="loading-dot"></div> 
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
