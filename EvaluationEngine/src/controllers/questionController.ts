
import { AIService } from '../services/aiService';
import { EvaluationService } from '../services/evaluationService';
import { CSVService } from '../services/csvService';
import { Request, Response } from 'express';

export class QuestionController {
    private aiService: AIService;
    private evaluationService: EvaluationService;
    private csvService: CSVService;
    constructor() {
        this.aiService = new AIService();
        this.evaluationService = new EvaluationService();
        this.csvService = new CSVService();
    }

    async fetchQuestions(req: Request, res: Response) {
        const { skill, skillLevel } = req.body;
        try {
            // Fetch questions from OpenAI (or LLM) based on skill and skillLevel
            const questions = await this.aiService.generateQuestions({ techStack: skill, skillLevel });
            res.json({ questions });
        } catch (err) {
            res.status(500).send('Failed to fetch questions from AI.');
        }
    }

    async submitAnswers(req: Request, res: Response) {
        // Accepts: { email, answers: [{id, answer}], skill, skillLevel, candidateName }
        // If questions are not provided, fetch them from AIService
        let { questions, answers, skill, skillLevel, candidateName, email } = req.body;
        try {
            if (!questions && skill && skillLevel) {
                // Fetch questions for the skill/level
                questions = await this.aiService.generateQuestions({ techStack: skill, skillLevel });
            }
            if (!questions || !answers || !Array.isArray(answers) || answers.length === 0) {
                return res.status(400).json({ error: 'Questions and answers are required.' });
            }
            // Map answers to array of values if needed
            let answerValues = answers;
            if (answers.length && typeof answers[0] === 'object' && 'answer' in answers[0]) {
                answerValues = answers.map(a => a.answer);
            }
            // Evaluate answers using EvaluationService
            const score = this.evaluationService.handleEvaluation(questions, answerValues);
            const result = this.evaluationService.processScore(score, questions.length);

            // Prepare user answers and correct answers for CSV
            const userAnswers = questions.map((q: any, idx: number) => {
                const ansObj = Array.isArray(answers) && answers.find((a: any) => a.id === q.id);
                return ansObj ? ansObj.answer : (answerValues[idx] || '');
            });
            const correctAnswers = questions.map((q: any) => q.correctAnswer);

            // Save to CSV database (single row per evaluation)
            const date = new Date();
            const evaluationRecord = {
                id: Date.now(),
                candidateName: candidateName || email || 'Unknown',
                skill: skill || 'Unknown',
                skillLevel: skillLevel || 'Unknown',
                score,
                date: date.toISOString(),
                userAnswers: JSON.stringify(userAnswers),
                correctAnswers: JSON.stringify(correctAnswers)
            };
            const filePath = 'skills_database.csv';
            try {
                let records = [];
                try {
                    records = await this.csvService.readFromCSV(filePath);
                } catch (e) {
                    console.error('Error reading CSV:', e);
                    records = [];
                }
                records.push(evaluationRecord);
                await this.csvService.saveToCSV(records, filePath);
                res.json({
                    message: 'Answers evaluated and saved successfully',
                    skill: evaluationRecord.skill,
                    skillLevel: evaluationRecord.skillLevel,
                    score,
                    result
                });
            } catch (e) {
                console.error('Error saving to CSV:', e);
                let errorMsg = '';
                if (e && typeof e === 'object' && 'message' in e) {
                    errorMsg = (e as any).message;
                } else {
                    errorMsg = JSON.stringify(e);
                }
                res.status(500).json({ error: 'Failed to save evaluation to CSV.', details: errorMsg });
            }
        } catch (err) {
            res.status(500).send('Failed to evaluate answers.');
        }
    }
}