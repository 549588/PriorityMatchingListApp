// src/apiConfig.ts
// Centralized config for external evaluation/question API

export const EVAL_API_URL = process.env.Net_APP_EVAL_API_URL || 'https://localhost:58654';


// Start interview session
export const startInterview = async ({ id, name, skill, expertLevel, questionCount }: {
  id: string;
  name: string;
  skill: string;
  expertLevel: number;
  questionCount: number;
}) => {
  const res = await fetch(`${EVAL_API_URL}/api/Interview/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, skill, expertLevel, questionCount })
  });
  if (!res.ok) throw new Error('Failed to start interview');
  return res.json();
};


// Get next question (and submit answer)
export const nextQuestion = async ({ candidateId, selectedChoice }: {
  candidateId: string;
  selectedChoice: string;
}) => {
  const res = await fetch(`${EVAL_API_URL}/api/Interview/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId, selectedChoice })
  });
  if (!res.ok) throw new Error('Failed to get next question');
  return res.json();
};

// No feedback endpoint in new API, remove getFeedback
