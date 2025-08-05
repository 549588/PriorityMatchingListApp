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
const emailService_1 = require("../services/emailService");
const aiService_1 = require("../services/aiService");
const csvService_1 = require("../services/csvService");
class EvaluationController {
    constructor() {
        this.emailService = new emailService_1.EmailService();
        this.aiService = new aiService_1.AIService();
        this.csvService = new csvService_1.CSVService();
    }
    triggerEvaluationRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, skills, techStack, skillLevel } = req.body; // skills: string[]
            const skill = skills && skills.length > 0 ? skills[0] : 'General';
            try {
                yield this.emailService.sendEvaluationRequest(email, skill);
                // Fetch AI-generated questions based on techStack, skillLevel
                const questions = yield this.aiService.generateQuestions({ techStack, skillLevel });
                res.json({
                    message: `Evaluation registration request sent to ${email} for skill: ${skill}`,
                    questions
                });
            }
            catch (err) {
                res.status(500).send('Failed to send evaluation request email or fetch questions.');
            }
        });
    }
    saveEvaluationScore(req, res) {
        // Only acknowledge the save, do not write to CSV (handled in /questions/submit)
        const { score, candidateName } = req.body;
        res.send(`Score for ${candidateName} saved: ${score}`);
    }
}
exports.default = EvaluationController;
