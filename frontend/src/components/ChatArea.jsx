import React, { useEffect, useRef } from "react";
import Latex from 'react-latex-next'; // Import Latex
import 'katex/dist/katex.min.css'; // Ensure KaTeX CSS is imported (redundant if in index.html, but safe)
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
                    className={`message-block ${message.role}`} // Use a block container
                >
                    <div
                        className={`message-bubble ${message.role} ${message.isError ? 'error' : ''}`} // Add error class if needed
                    >
                        <Latex>{message.content || ''}</Latex> {/* Render content with Latex */}
                        <div className="message-timestamp"> 
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                    {/* Display Context Questions for Assistant messages */}
                    {message.role === 'assistant' && message.context_used && message.context_used.length > 0 && (
                        <div className="context-questions">
                            <h4 className="context-title">Context Used:</h4>
                            <ul className="context-list">
                                {message.context_used.map((context, ctxIndex) => (
                                    <li key={ctxIndex} className="context-item">
                                        <Latex>{context || ''}</Latex> {/* Render context with Latex */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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
