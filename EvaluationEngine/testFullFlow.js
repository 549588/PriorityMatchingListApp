import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testFullFlow() {
  try {
    // 1. Trigger evaluation and get questions
    const evalRes = await axios.post(`${BASE_URL}/evaluate`, {
      email: 'test@example.com',
      skills: ['java'],
      techStack: 'java',
      skillLevel: 'low'
    });
    console.log('POST /evaluate:', evalRes.data);
    const questions = evalRes.data.questions;

    // 2. Prepare answers (simulate all correct for test)
    const answers = questions.map(q => ({ id: q.id, answer: q.correctAnswer }));

    // 3. Submit answers with questions array
    const submitRes = await axios.post(`${BASE_URL}/questions/submit`, {
      email: 'test@example.com',
      answers,
      questions,
      skill: 'java',
      skillLevel: 'low',
      candidateName: 'Test User'
    });
    console.log('POST /questions/submit:', submitRes.data);

    // 4. Save score
    const saveScoreRes = await axios.post(`${BASE_URL}/save-score`, {
      email: 'test@example.com',
      candidateName: 'Test User',
      score: submitRes.data.score,
      skill: 'java',
      skillLevel: 'low'
    });
    console.log('POST /save-score:', saveScoreRes.data);
  } catch (e) {
    console.error('Full error object:', e);
    if (e.response) {
      console.error('Error response data:', e.response.data);
      console.error('Error response status:', e.response.status);
      console.error('Error response headers:', e.response.headers);
    } else if (e.request) {
      console.error('Error request:', e.request);
    } else {
      console.error('Error message:', e.message);
    }
    if (e.stack) {
      console.error('Error stack:', e.stack);
    }
  }
}

testFullFlow();
