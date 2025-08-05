
import { EmailService } from '../services/emailService';
import { AIService } from '../services/aiService';
import { CSVService } from '../services/csvService';
import { Request, Response } from 'express';


class EvaluationController {
    private emailService: EmailService;
    private aiService: AIService;
    private csvService: CSVService;
    constructor() {
        this.emailService = new EmailService();
        this.aiService = new AIService();
        this.csvService = new CSVService();
    }


    async triggerEvaluationRequest(req: Request, res: Response) {
        const { email, skills, techStack, skillLevel } = req.body; // skills: string[]
        const skill = skills && skills.length > 0 ? skills[0] : 'General';
        try {
            await this.emailService.sendEvaluationRequest(email, skill);
            // Fetch AI-generated questions based on techStack, skillLevel
            const questions = await this.aiService.generateQuestions({ techStack, skillLevel });
            res.json({
                message: `Evaluation registration request sent to ${email} for skill: ${skill}`,
                questions
            });
        } catch (err) {
            res.status(500).send('Failed to send evaluation request email or fetch questions.');
        }
    }

    saveEvaluationScore(req: Request, res: Response) {
        // Only acknowledge the save, do not write to CSV (handled in /questions/submit)
        const { score, candidateName } = req.body;
        res.send(`Score for ${candidateName} saved: ${score}`);
    }
}

export default EvaluationController;