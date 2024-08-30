// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');

    const description = `You are an AI tasked with generating MCQ test questions to assess a user's proficiency in a given topic. Generate the exact number of questions specified, from the specified complexity level. Estimate the test completion time based on: 1 minute per MCQ as base time, adjusted by complexity (low = 1, medium = 1.5, high = 2) with an additional 0.1 minutes per question for each complexity level. Criteria: '1' for low (basic concepts, single-step problems, direct questions), '2' for Medium (application of complex concepts, multi-step problems, advanced knowledge), '3' for high (advanced concepts, complex problem-solving, inference and analysis, may include code snippets). If complexity level is not specified, default to medium to high. Respond in a single line JSON format without special characters like '\n' or '\t' for easy parsing.Your response must strictly contain the following fields : question,options,skill,complexity.`;

    try {
      const response = await fetch('/api/generateQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      setError('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Quiz App</h1>
      <button onClick={fetchQuestions} disabled={loading}>
        {loading ? 'Loading...' : 'Generate Quiz'}
      </button>

      {error && <p>{error}</p>}

      {questions.length > 0 && (
        <div>
          {questions.map((q, idx) => (
            <div key={idx} style={{ margin: '20px 0' }}>
              <h3>{q.question}</h3>
              <ul>
                {q.options.map((option, index) => (
                  <li key={index}>{option.option}</li>
                ))}
              </ul>
              <p>Skill: {q.skill}</p>
              <p>Complexity: {q.complexity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
