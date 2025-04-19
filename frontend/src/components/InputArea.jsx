import React, { useState } from 'react';
import './InputArea.css'; // Import InputArea.css

const exams = [
  'NEET', 'JEE', 'GATE', 'UPSC', 'SSC', 'Banking', 'General'
];

const subjects = {
  NEET: ['Physics', 'Chemistry', 'Biology'],
  JEE: ['Physics', 'Chemistry', 'Mathematics'],
  GATE: ['Computer Science', 'Electronics', 'Mechanical', 'Civil'],
  UPSC: ['History', 'Geography', 'Polity', 'Economics', 'Science'],
  SSC: ['General Knowledge', 'Reasoning', 'Math', 'English'],
  Banking: ['Reasoning', 'Quantitative Aptitude', 'English', 'General Awareness'],
  General: ['General Knowledge', 'General Subject']
};

const InputArea = ({ sendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [exam, setExam] = useState('General');
  const [subject, setSubject] = useState(subjects.General[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim(), exam, subject);
      setMessage('');
    }
  };

  const handleExamChange = (e) => {
    const selectedExam = e.target.value;
    setExam(selectedExam);
    setSubject(subjects[selectedExam][0]);
  };

  return (
    <div className="input-area-container">
      <div className="input-area-content">
        <div className="selectors-container">
          <div className="selector-group">
            <label htmlFor="exam" className="selector-label">
              Exam
            </label>
            <select
              id="exam"
              value={exam}
              onChange={handleExamChange}
              className="selector-element"
            >
              {exams.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div className="selector-group">
            <label htmlFor="subject" className="selector-label">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="selector-element"
            >
              {subjects[exam].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="message-form">
          <div className="textarea-container">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="2"
              disabled={disabled}
              className="message-textarea"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="send-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputArea;