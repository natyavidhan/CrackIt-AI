import React, { useState } from 'react';

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
    <div className="border-t border-gray-700 bg-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 flex gap-4">
          <div className="w-1/2">
            <label htmlFor="exam" className="block text-sm font-medium mb-1">
              Exam
            </label>
            <select
              id="exam"
              value={exam}
              onChange={handleExamChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {exams.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects[exam].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="2"
              disabled={disabled}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-medium rounded-lg p-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputArea;