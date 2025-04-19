import React, { useEffect, useRef, useState } from "react"; // Import useState
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import './ChatArea.css';
import QuestionModal from './QuestionModal'; // Import the modal component

const ChatArea = ({ currentChat, loading }) => {
    const messagesEndRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messages]);

    const handleContextClick = (questionData) => {
        setSelectedQuestion(questionData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedQuestion(null);
    };

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
        <> {/* Use Fragment to wrap ChatArea and Modal */}
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
                                        {message.context_used.map((contextDoc, ctxIndex) => (
                                            <li key={contextDoc._id || ctxIndex} className="context-item">
                                                {/* Make the box clickable */}
                                                <div
                                                    className="context-question-box"
                                                    onClick={() => handleContextClick(contextDoc)} // Add onClick handler
                                                    role="button" // Add role for accessibility
                                                    tabIndex={0} // Add tabIndex for accessibility
                                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleContextClick(contextDoc); }} // Keyboard accessibility
                                                >
                                                    {/* Display only the question text initially */}
                                                    <Latex>{contextDoc.question || 'Context item'}</Latex>
                                                </div>
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

            {/* Render Modal conditionally */}
            {isModalOpen && selectedQuestion && (
                <QuestionModal question={selectedQuestion} onClose={closeModal} />
            )}
        </>
    );
};

export default ChatArea;
