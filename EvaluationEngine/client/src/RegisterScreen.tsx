import React, { useState, useEffect } from 'react';
import { startInterview } from './apiConfig.ts';
import axios from 'axios';
import Spinner from './Spinner.tsx';

interface RegisterScreenProps {
  email: string;
}

// Configurable values
const QUESTION_COUNT = Number(process.env.REACT_APP_EVAL_QUESTION_COUNT) || 10;
const COOLDOWN_DAYS = Number(process.env.REACT_APP_EVAL_COOLDOWN_DAYS) || 3;
const USE_COOLDOWN = process.env.REACT_APP_EVAL_USE_COOLDOWN !== 'false'; // default true

const RegisterScreen: React.FC<RegisterScreenProps & { onStartEvaluation: (evalInfo: any) => void }> = ({ email, onStartEvaluation }) => {
  const [skills, setSkills] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cooldowns, setCooldowns] = useState<{ [skill: string]: number }>({});
  const [startingSkill, setStartingSkill] = useState<string | null>(null);
  const [evaluationScores, setEvaluationScores] = useState<{ [skill: string]: number | null }>({});
  // Load cooldowns from localStorage
  useEffect(() => {
    const cd = localStorage.getItem(`eval_cooldowns_${email}`);
    if (cd) setCooldowns(JSON.parse(cd));
  }, [email]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Fetch user info and skills from backend
        const res = await axios.post('http://localhost:3000/register-info', { email });
        setUserInfo(res.data.user);
        setSkills(res.data.skill || []);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load skills.');
        setLoading(false);
      }
    };
    fetchSkills();
  }, [email]);

  if (loading) return <Spinner message="Loading skills..." />;
  if (error) return <div style={{color:'red',textAlign:'center',marginTop:60}}>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)', padding: 40 }}>
      <div style={{ maxWidth: 800, margin: 'auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px 0 rgba(80,80,180,0.10)', padding: 36, position: 'relative' }}>
        {/* Logout link at top right */}
        <button
          onClick={() => window.location.reload()}
          style={{ position: 'absolute', top: 24, right: 32, background: 'none', border: 'none', color: '#6366f1', fontWeight: 500, cursor: 'pointer', fontSize: 16 }}
        >
          Logout
        </button>
        {/* Employee ID above the table, right-aligned */}
        <div style={{ position: 'absolute', top: 24, left: 32, color: '#6366f1', fontWeight: 600, fontSize: 16 }}>
          Employee ID: {userInfo?.employeeId || '-'}
        </div>
        <h2 style={{ color: '#3b3b7a', marginBottom: 8, textAlign: 'center', fontSize: 32, fontWeight: 700 }}>Evaluation Dashboard</h2>
        <div style={{ marginBottom: 18, color: '#444', textAlign: 'left' }}>
          <b>User:</b> {userInfo?.name || email}<br/>
          <b>Email:</b> {email}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 18 }}>
          <thead>
            <tr style={{ background: '#f1f5ff' }}>
              <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>Skill</th>
              <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>Description</th>
              <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>Expertise Level</th>
              <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>Supervisor Rated Skill Level</th>
              <th style={{ padding: 10, border: '1px solid #e5e7eb' }}>Take Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {skills.map(skill => {
              // Only show Take Evaluation if SupervisorRatedSkillLevel is present and not null/empty/zero
              const hasSupervisorLevel = skill.SupervisorRatedSkillLevel !== undefined && skill.SupervisorRatedSkillLevel !== null && skill.SupervisorRatedSkillLevel !== '' && skill.SupervisorRatedSkillLevel !== 0;
              return (
                <tr key={skill.EmployeeSkillID}>
                  <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>{skill.SkillName}</td>
                  <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>{skill.SkillDescription}</td>
                  <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>{skill.EmployeeRatedSkillLevel}</td>
                  <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>{skill.SupervisorRatedSkillLevel ?? '-'}</td>
                  <td style={{ padding: 10, border: '1px solid #e5e7eb' }}>
                    {skill.AIEvaluatedScore !== undefined && skill.AIEvaluatedScore !== null ? (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Score: {skill.AIEvaluatedScore}</span>
                    ) : evaluationScores[skill.SkillName] !== undefined && evaluationScores[skill.SkillName] !== null ? (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Score: {evaluationScores[skill.SkillName]}</span>
                    ) : hasSupervisorLevel ? (
                      (!USE_COOLDOWN || !cooldowns[skill.SkillName] || Date.now() >= cooldowns[skill.SkillName]) ? (
                        <button
                          style={{
                            color: '#fff',
                            background: '#6366f1',
                            fontWeight: 500,
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 16px',
                            cursor: 'pointer'
                          }}
                          onClick={async () => {
                            setStartingSkill(skill.SkillName);
                            // Use SupervisorRatedSkillLevel as mappedSkillLevel directly
                            let mappedSkillLevel = Number(skill.SupervisorRatedSkillLevel);
                            if (isNaN(mappedSkillLevel)) mappedSkillLevel = 0;
                            try {
                              const res = await startInterview({
                                id: userInfo?.employeeId,
                                name: userInfo?.name || email,
                                skill: skill.SkillName,
                                expertLevel: mappedSkillLevel,
                                questionCount: QUESTION_COUNT
                              });
                              // Set cooldown if enabled
                              if (USE_COOLDOWN) {
                                const nextAllowed = Date.now() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
                                const newCooldowns = { ...cooldowns, [skill.SkillName]: nextAllowed };
                                setCooldowns(newCooldowns);
                                localStorage.setItem(`eval_cooldowns_${email}`, JSON.stringify(newCooldowns));
                              }
                              let initialQuestion: any = null;
                              if (res.currentQuestion && res.currentQuestion.question && res.currentQuestion.choices) {
                                initialQuestion = { question: res.currentQuestion.question, options: res.currentQuestion.choices };
                              }
                              // Wrap onStartEvaluation to capture score after evaluation
                              const handleEval = async (evalInfo: any) => {
                                // Call the original onStartEvaluation
                                await onStartEvaluation(evalInfo);
                              };
                              handleEval({
                                candidateId: userInfo?.employeeId,
                                skill: skill.SkillName,
                                expertLevel: mappedSkillLevel,
                                questionCount: QUESTION_COUNT,
                                name: userInfo?.name || email,
                                initialQuestion,
                                setScore: (score: number) => setEvaluationScores(s => ({ ...s, [skill.SkillName]: score }))
                              });
                            } catch (e) {
                              alert('Failed to start evaluation.');
                            }
                            setStartingSkill(null);
                          }}
                        >
                          {startingSkill === skill.SkillName ? (
                            <div style={{
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              width: '100vw',
                              height: '100vh',
                              background: 'rgba(255,255,255,0.7)',
                              zIndex: 9999,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Spinner message="Starting..." />
                            </div>
                          ) : 'Take Evaluation'}
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{
                            color: '#fff',
                            background: '#a5b4fc',
                            fontWeight: 500,
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 16px',
                            cursor: 'not-allowed'
                          }}
                        >
                          {`Available in ${Math.ceil((cooldowns[skill.SkillName] - Date.now()) / (1000 * 60 * 60 * 24))} days`}
                        </button>
                      )
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterScreen;
