import React from 'react';
import Latex from 'react-latex-next';
import './QuestionModal.css'; // Import CSS for the modal

const QuestionModal = ({ question, onClose }) => {
  if (!question) return null;

  const isMCQ = question.correct_value === null || question.correct_value === undefined;
  const correctOptionIndex = isMCQ && question.correct_option && question.correct_option.length > 0
    ? question.correct_option[0] - 1 // Assuming correct_option is 1-based index
    : -1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
        <button className="modal-close-button" onClick={onClose} aria-label="Close modal">&times;</button>

        <div className="modal-section modal-question">
          <h4>Question:</h4>
          <Latex>{question.question || 'N/A'}</Latex>
        </div>

        <div className="modal-section modal-answer">
          <h4>Answer:</h4>
          {isMCQ ? (
            <ul className="modal-options-list">
              {(question.options || []).map((option, index) => (
                <li
                  key={index}
                  className={index === correctOptionIndex ? 'correct-option' : ''}
                >
                  {String.fromCharCode(65 + index)}. <Latex>{option}</Latex> {/* A, B, C... */}
                </li>
              ))}
              {correctOptionIndex === -1 && <li>No correct option specified.</li>}
            </ul>
          ) : (
            <p className="modal-integer-answer">
              Correct Value: <Latex>{String(question.correct_value)}</Latex>
            </p>
          )}
        </div>

        {question.explanation && question.explanation !== 'N/A' && (
          <div className="modal-section modal-explanation">
            <h4>Explanation:</h4>
            <Latex>{question.explanation}</Latex>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionModal;
