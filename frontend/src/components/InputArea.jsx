import React, { useState } from 'react';
import './InputArea.css'; 

const exams = [
  { id: 'b3b5a8d8-f409-4e01-8fd4-043d3055db5e', name: 'JEE Main' },
  { id: '6d34f7cd-c80e-4a42-8c35-2b167f459c06', name: 'JEE Advanced' },
  { id: 'c8da26c7-cf1b-421f-829b-c95dbdd3cc6a', name: 'BITSAT' },
  { id: 'bb792041-50de-4cfe-83f3-f899a79c0930', name: 'COMEDK' },
  { id: '4625ad6f-33db-4c22-96e0-6c23830482de', name: 'NEET' }
];

const subjects = {
  'b3b5a8d8-f409-4e01-8fd4-043d3055db5e': [ 
    { id: '7bc04a29-039c-430d-980d-a066b16efc86', name: 'Physics' },
    { id: 'bdcc1b1b-5d9d-465d-a7b8-f9619bb61fe7', name: 'Chemistry' },
    { id: 'f1d41a0c-1a71-4994-90f3-4b5d82a6f5f9', name: 'Mathematics' }
  ],
  '6d34f7cd-c80e-4a42-8c35-2b167f459c06': [ 
    { id: 'f66d8bfb-ba6a-4b3f-adbc-fbf402e39020', name: 'Physics' },
    { id: '17d9f684-251f-4f52-8092-1b54b33b1ed5', name: 'Chemistry' },
    { id: '96b44962-2c79-4a42-87ce-f8b87c9e174a', name: 'Mathematics' }
  ],
  'c8da26c7-cf1b-421f-829b-c95dbdd3cc6a': [ 
    { id: '45363e06-86a7-4d8e-be8d-318ee79af980', name: 'Physics' },
    { id: '416dff44-e43b-4cd3-8c5a-d30b56d24151', name: 'Chemistry' },
    { id: '6848df90-e6d7-4505-a691-53956ebf45a2', name: 'Mathematics' } 
  ],
  'bb792041-50de-4cfe-83f3-f899a79c0930': [ 
    { id: '1ff8290a-8193-4001-a93e-8aa8fcb1f3ac', name: 'Physics' },
    { id: '6ec16a3d-177a-44f3-b342-4c51cf2b1045', name: 'Chemistry' },
    { id: '3d7d5653-4382-4275-be29-58b0eea9f510', name: 'Mathematics' }
  ],
  '4625ad6f-33db-4c22-96e0-6c23830482de': [ 
    { id: '4b89e781-8987-47aa-84b6-d95025d590b0', name: 'Physics' },
    { id: '45966dd6-eaed-452f-bfcc-e9632c72da0f', name: 'Chemistry' },
    { id: '634d1a76-ecfd-4d2b-bdb9-5d6658948236', name: 'Biology' }
  ]
};

const defaultExamId = exams.find(e => e.name === 'General')?.id || exams[0]?.id;

const defaultSubjectId = defaultExamId ? (subjects[defaultExamId]?.[0]?.id || null) : null;

const InputArea = ({ sendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [examId, setExamId] = useState(defaultExamId);
  const [subjectId, setSubjectId] = useState(defaultSubjectId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && examId && subjectId) { 
      sendMessage(message.trim(), examId, subjectId); 
      setMessage('');
    } else {
        alert("Please ensure both an exam and subject are selected.");
    }
  };

  const handleExamChange = (e) => {
    const selectedExamId = e.target.value;
    setExamId(selectedExamId);
    
    const firstSubjectId = subjects[selectedExamId]?.[0]?.id || null;
    setSubjectId(firstSubjectId);
  };

  const currentSubjects = subjects[examId] || [];

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
              value={examId} 
              onChange={handleExamChange}
              className="selector-element"
              disabled={!defaultExamId} 
            >
              {exams.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div className="selector-group">
            <label htmlFor="subject" className="selector-label">
              Subject
            </label>
            <select
              id="subject"
              value={subjectId || ''} 
              onChange={(e) => setSubjectId(e.target.value)} 
              className="selector-element"
              disabled={!examId || currentSubjects.length === 0} 
            >
               {!subjectId && currentSubjects.length > 0 && <option value="" disabled>Select Subject</option>}
               {currentSubjects.length === 0 && <option value="" disabled>No subjects available</option>}
              {currentSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
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
            disabled={!message.trim() || disabled || !examId || !subjectId} 
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