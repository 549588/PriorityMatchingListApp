import { Router } from 'express';
import EvaluationController from '../controllers/evaluationController';

const evaluationController = new EvaluationController();
const router = Router();

// POST /evaluate expects { email: string, skills: string[] }
export function setEvaluationRoutes(app: Router) {
    app.post('/evaluate', evaluationController.triggerEvaluationRequest.bind(evaluationController));
    app.post('/save-score', evaluationController.saveEvaluationScore.bind(evaluationController));
}