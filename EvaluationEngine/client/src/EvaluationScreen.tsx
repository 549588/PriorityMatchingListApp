
import React, { useState, useEffect } from 'react';
import { nextQuestion } from './apiConfig.ts';
import Spinner from './Spinner.tsx';


interface Question {
  question: string;
  options: string[];
}

interface EvaluationScreenProps {
  candidateId: string;
  skill: string;
  expertLevel: string;
  questionCount: number;
  name: string;
  initialQuestion: Question;
  onFinish: (score: number) => void;
  onLogout: () => void;
}


const EvaluationScreen: React.FC<EvaluationScreenProps> = ({ candidateId, skill, expertLevel, questionCount, name, initialQuestion, onFinish, onLogout }) => {
  const [currentQ, setCurrentQ] = useState<number>(0);
  const [questionData, setQuestionData] = useState<Question | null>(
    initialQuestion && initialQuestion.question && initialQuestion.options && initialQuestion.options.length > 0
      ? initialQuestion
      : null
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!selected || !questionData) return;
    setLoading(true);
    let res;
    try {
      // Find the numeric index of the selected choice
      const selectedIndex = questionData.options.findIndex(opt => opt === selected);
      if (selectedIndex === -1) throw new Error('Invalid choice');
      res = await nextQuestion({ candidateId, selectedChoice: String(selectedIndex) });
      setAnswers(prev => [...prev, selected]);
      setSelected(null);
      // If currentQuestion is null, evaluation is complete
      if (!res.currentQuestion) {
        const finalScore = res.skillScores?.[skill] ?? 0;
        setScore(finalScore);
        setTimeout(() => onFinish(finalScore), 1200);
      } else {
        setCurrentQ(q => q + 1);
        // Map API response to expected Question structure
        if (res.currentQuestion.question && Array.isArray(res.currentQuestion.choices)) {
          setQuestionData({
            question: res.currentQuestion.question,
            options: res.currentQuestion.choices
          });
        } else {
          setQuestionData(null);
        }
      }
    } catch (err) {
      setError('Failed to submit answer.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (score !== null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)' }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px 0 rgba(80,80,180,0.10)', padding: 40, textAlign: 'center', minWidth: 350 }}>
          <h2 style={{ color: '#3b3b7a' }}>Evaluation Complete!</h2>
          <p style={{ fontSize: 20, margin: '18px 0' }}>Your Score: <b>{score}</b></p>
          <button onClick={() => onFinish(score)} style={{ marginRight: 16 }}>Back to Registration</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
    );
  }

  if (loading) return <Spinner message="Loading..." />;
  if (error) return <div style={{color:'red',textAlign:'center',marginTop:60}}>{error}</div>;

  // Defensive check for questionData and options
  if (!questionData || !Array.isArray(questionData.options) || questionData.options.length === 0) {
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: 60 }}>
        Failed to load the question or options. Please contact support or try again.<br/>
        <pre style={{ color: '#444', fontSize: 13, marginTop: 16 }}>{JSON.stringify(questionData || initialQuestion, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px 0 rgba(80,80,180,0.10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Question {currentQ + 1} / {questionCount}</h2>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 500, cursor: 'pointer' }}>Logout</button>
      </div>
      <div style={{ fontSize: 18, marginBottom: 18 }}>{questionData.question}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {questionData.options.map((opt, i) => (
          <label key={i} style={{ background: selected === opt ? '#e0e7ff' : '#f8fafc', padding: 10, borderRadius: 8, cursor: 'pointer', border: '1px solid #c7d2fe' }}>
            <input
              type="radio"
              name="answer"
              value={opt}
              checked={selected === opt}
              onChange={() => setSelected(opt)}
              style={{ marginRight: 10 }}
            />
            {opt}
          </label>
        ))}
      </div>
      <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
        <button onClick={handleSubmit} disabled={!selected}>
          {currentQ + 1 === questionCount ? 'Submit & Finish' : 'Submit & Next'}
        </button>
      </div>
    </div>
  );
};

export default EvaluationScreen;
