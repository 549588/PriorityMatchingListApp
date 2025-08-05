"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const aiService_1 = require("../services/aiService");
const evaluationService_1 = require("../services/evaluationService");
const csvService_1 = require("../services/csvService");
class QuestionController {
    constructor() {
        this.aiService = new aiService_1.AIService();
        this.evaluationService = new evaluationService_1.EvaluationService();
        this.csvService = new csvService_1.CSVService();
    }
    fetchQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { skill, skillLevel } = req.body;
            try {
                // Fetch questions from OpenAI (or LLM) based on skill and skillLevel
                const questions = yield this.aiService.generateQuestions({ techStack: skill, skillLevel });
                res.json({ questions });
            }
            catch (err) {
                res.status(500).send('Failed to fetch questions from AI.');
            }
        });
    }
    submitAnswers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Accepts: { email, answers: [{id, answer}], skill, skillLevel, candidateName }
            // If questions are not provided, fetch them from AIService
            let { questions, answers, skill, skillLevel, candidateName, email } = req.body;
            try {
                if (!questions && skill && skillLevel) {
                    // Fetch questions for the skill/level
                    questions = yield this.aiService.generateQuestions({ techStack: skill, skillLevel });
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
                const userAnswers = questions.map((q, idx) => {
                    const ansObj = Array.isArray(answers) && answers.find((a) => a.id === q.id);
                    return ansObj ? ansObj.answer : (answerValues[idx] || '');
                });
                const correctAnswers = questions.map((q) => q.correctAnswer);
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
                        records = yield this.csvService.readFromCSV(filePath);
                    }
                    catch (e) {
                        console.error('Error reading CSV:', e);
                        records = [];
                    }
                    records.push(evaluationRecord);
                    yield this.csvService.saveToCSV(records, filePath);
                    res.json({
                        message: 'Answers evaluated and saved successfully',
                        skill: evaluationRecord.skill,
                        skillLevel: evaluationRecord.skillLevel,
                        score,
                        result
                    });
                }
                catch (e) {
                    console.error('Error saving to CSV:', e);
                    let errorMsg = '';
                    if (e && typeof e === 'object' && 'message' in e) {
                        errorMsg = e.message;
                    }
                    else {
                        errorMsg = JSON.stringify(e);
                    }
                    res.status(500).json({ error: 'Failed to save evaluation to CSV.', details: errorMsg });
                }
            }
            catch (err) {
                res.status(500).send('Failed to evaluate answers.');
            }
        });
    }
}
exports.QuestionController = QuestionController;
