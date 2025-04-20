import React, { useEffect, useRef, useState } from "react"; 
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import './ChatArea.css';
import QuestionModal from './QuestionModal'; 

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
                    <img src={"/logo.png"} alt="CrackIt AI Logo" className="welcome-logo" /> 
                    <h3>Welcome to CrackIt AI</h3> 
                    <p>Select a chat from the sidebar or start a new conversation</p>
                </div>
            </div>
        );
    }

    return (
        <> 
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
                            className={`message-block ${message.role}`} 
                        >
                            <div
                                className={`message-bubble ${message.role} ${message.isError ? 'error' : ''}`} 
                            >
                                <Latex>{(message.content || '').replaceAll('\n', '<br />')}</Latex> 
                                <div className="message-timestamp"> 
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                            
                            {message.role === 'assistant' && message.context_used && message.context_used.length > 0 && (
                                <div className="context-questions">
                                    <h4 className="context-title">Context Used:</h4>
                                    <ul className="context-list">
                                        {message.context_used.map((contextDoc, ctxIndex) => (
                                            <li key={contextDoc._id || ctxIndex} className="context-item">
                                                
                                                <div
                                                    className="context-question-box"
                                                    onClick={() => handleContextClick(contextDoc)} 
                                                    role="button" 
                                                    tabIndex={0} 
                                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleContextClick(contextDoc); }} 
                                                >
                                                    
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

            
            {isModalOpen && selectedQuestion && (
                <QuestionModal question={selectedQuestion} onClose={closeModal} />
            )}
        </>
    );
};

export default ChatArea;
