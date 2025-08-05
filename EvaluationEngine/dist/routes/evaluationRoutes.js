"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEvaluationRoutes = void 0;
const express_1 = require("express");
const evaluationController_1 = __importDefault(require("../controllers/evaluationController"));
const evaluationController = new evaluationController_1.default();
const router = (0, express_1.Router)();
// POST /evaluate expects { email: string, skills: string[] }
function setEvaluationRoutes(app) {
    app.post('/evaluate', evaluationController.triggerEvaluationRequest.bind(evaluationController));
    app.post('/save-score', evaluationController.saveEvaluationScore.bind(evaluationController));
}
exports.setEvaluationRoutes = setEvaluationRoutes;
