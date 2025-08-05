"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setQuestionRoutes = void 0;
const express_1 = require("express");
const questionController_1 = require("../controllers/questionController");
const router = (0, express_1.Router)();
const questionController = new questionController_1.QuestionController();
function setQuestionRoutes(app) {
    app.get('/questions', questionController.fetchQuestions.bind(questionController));
    app.post('/questions/fetchQuestions', questionController.fetchQuestions.bind(questionController));
    app.post('/questions/submit', questionController.submitAnswers.bind(questionController));
}
exports.setQuestionRoutes = setQuestionRoutes;
