// src/components/Polls.jsx
import React, { useState } from 'react';

const Polls = () => {
  const [poll, setPoll] = useState({
    question: "What event should we hold next?",
    options: [
      { text: "Q&A Session", votes: 5 },
      { text: "Guest Speaker", votes: 3 },
      { text: "Networking Event", votes: 2 },
    ],
  });

  const handleVote = (index) => {
    const newOptions = poll.options.map((option, idx) =>
      idx === index ? { ...option, votes: option.votes + 1 } : option
    );
    setPoll({ ...poll, options: newOptions });
  };

  return (
    <div className="polls">
      <h2>Group Poll</h2>
      <p>{poll.question}</p>
      {poll.options.map((option, index) => (
        <div key={index} onClick={() => handleVote(index)} className="poll-option">
          <span>{option.text}</span>
          <span>Votes: {option.votes}</span>
        </div>
      ))}
    </div>
  );
};

export default Polls;
