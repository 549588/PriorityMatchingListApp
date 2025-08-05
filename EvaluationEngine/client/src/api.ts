import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const register = (data: any) => axios.post(`${BASE_URL}/evaluate`, data);
export const fetchQuestions = (data: any) => axios.post(`${BASE_URL}/questions/fetchQuestions`, data);
export const submitAnswers = (data: any) => axios.post(`${BASE_URL}/questions/submit`, data);
export const saveScore = (data: any) => axios.post(`${BASE_URL}/save-score`, data);
