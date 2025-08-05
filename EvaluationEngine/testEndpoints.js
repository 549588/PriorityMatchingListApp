import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testEvaluate() {
  const res = await axios.post(`${BASE_URL}/evaluate`, {
    email: 'test@example.com',
    skills: ['java'],
    techStack: 'java',
    skillLevel: 'low'
  });
  console.log('POST /evaluate:', res.data);
}

async function testFetchQuestions() {
  const res = await axios.post(`${BASE_URL}/questions/fetchQuestions`, {
    skill: 'java',
    skillLevel: 'low'
  });
  console.log('POST /questions/fetchQuestions:', res.data);
}

async function testSubmitAnswers() {
  const res = await axios.post(`${BASE_URL}/questions/submit`, {
    email: 'test@example.com',
    answers: [
      { id: 1, answer: 'A' },
      { id: 2, answer: 'B' }
    ]
  });
  console.log('POST /questions/submit:', res.data);
}

async function testSaveScore() {
  const res = await axios.post(`${BASE_URL}/save-score`, {
    email: 'test@example.com',
    score: 8,
    skill: 'java',
    skillLevel: 'low'
  });
  console.log('POST /save-score:', res.data);
}

async function testGetQuestions() {
  const res = await axios.get(`${BASE_URL}/questions`);
  console.log('GET /questions:', res.data);
}

async function runAllTests() {
  try {
    await testEvaluate();
  } catch (e) { console.error('Error in /evaluate:', e.response?.data || e.message); }
  try {
    await testFetchQuestions();
  } catch (e) { console.error('Error in /questions/fetchQuestions:', e.response?.data || e.message); }
  try {
    await testSubmitAnswers();
  } catch (e) { console.error('Error in /questions/submit:', e.response?.data || e.message); }
  try {
    await testSaveScore();
  } catch (e) { console.error('Error in /save-score:', e.response?.data || e.message); }
  try {
    await testGetQuestions();
  } catch (e) { console.error('Error in GET /questions:', e.response?.data || e.message); }
}

runAllTests();
