import { Router } from 'express';
import { QuestionController } from '../controllers/questionController';

const router = Router();
const questionController = new QuestionController();

export function setQuestionRoutes(app: Router) {
    app.get('/questions', questionController.fetchQuestions.bind(questionController));
    app.post('/questions/fetchQuestions', questionController.fetchQuestions.bind(questionController));
    app.post('/questions/submit', questionController.submitAnswers.bind(questionController));
}