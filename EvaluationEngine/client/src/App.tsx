import React, { useState } from 'react';
import axios from 'axios';
import RegisterScreen from './RegisterScreen.tsx';
import Login from './Login.tsx';
import EvaluationScreen from './EvaluationScreen.tsx';
import { updateEmployeeSkill } from './updateEmployeeSkill.ts';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [evaluationInfo, setEvaluationInfo] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [remarks, setRemarks] = useState('');

  const handleLogin = async (email: string, password: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${apiUrl}/login`, { email, password });
      if (response.data.success) {
        setIsLoggedIn(true);
        setLoginEmail(email);
        setTimeout(() => setShowRegister(true), 1000);
      } else {
        return response.data.message || 'Login failed';
      }
    } catch (err: any) {
      console.log(err.response);
      return err.response?.data?.message || 'Login failed';
    }
    return null;
  };

  // After registration, show evaluation screen if started
  if (showRegister && isLoggedIn && evaluationInfo) {
    return <EvaluationScreen
      candidateId={evaluationInfo.candidateId}
      skill={evaluationInfo.skill}
      expertLevel={evaluationInfo.expertLevel}
      questionCount={evaluationInfo.questionCount}
      name={evaluationInfo.name}
      initialQuestion={evaluationInfo.initialQuestion}
      onFinish={async (finalScore: number) => {
        // Generate remarks based on score
        let remarks = '';
        if (finalScore >= 90) remarks = `Excellent ${evaluationInfo.skill} proficiency.`;
        else if (finalScore >= 75) remarks = `Strong ${evaluationInfo.skill} fundamentals.`;
        else if (finalScore >= 60) remarks = `Good ${evaluationInfo.skill} skills.`;
        else if (finalScore >= 40) remarks = `Basic ${evaluationInfo.skill} understanding.`;
        else remarks = `Needs improvement in ${evaluationInfo.skill}.`;

        // Save last score for cool-off logic
        localStorage.setItem(`eval_last_score_${loginEmail}_${evaluationInfo.skill}`, String(finalScore));

        try {
          await updateEmployeeSkill({
            candidateId: evaluationInfo.candidateId,
            skill: evaluationInfo.skill,
            score: finalScore,
            remarks
          });
        } catch (e) {
          // Optionally handle error (e.g., show a message)
          console.error('Failed to update employee skill:', e);
        }
        setScore(finalScore);
        setRemarks(remarks);
        setShowResult(true);
        setEvaluationInfo(null);
      }}
      onLogout={() => {
        setIsLoggedIn(false);
        setLoginEmail('');
        setShowRegister(false);
        setEvaluationInfo(null);
        setShowResult(false);
        setScore(null);
      }}
    />;
  }

  // Show result screen after evaluation
  if (showResult && isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)' }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px 0 rgba(80,80,180,0.10)', padding: 40, textAlign: 'center', minWidth: 350 }}>
          <h2 style={{ color: '#3b3b7a' }}>Evaluation Complete!</h2>
          <p style={{ fontSize: 20, margin: '18px 0' }}>Your Score: <b>{score}</b></p>
          <p style={{ fontSize: 17, margin: '10px 0', color: '#6366f1' }}>{remarks}</p>
          <button onClick={() => { setShowResult(false); }} style={{ marginRight: 16 }}>Back to Registration</button>
          <button onClick={() => {
            setIsLoggedIn(false);
            setLoginEmail('');
            setShowRegister(false);
            setEvaluationInfo(null);
            setShowResult(false);
            setScore(null);
            setRemarks('');
          }}>Logout</button>
        </div>
      </div>
    );
  }

  // Render: show login, then registration
  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <RegisterScreen email={loginEmail} onStartEvaluation={setEvaluationInfo} />
      )}
    </div>
  );
}


export default App;
