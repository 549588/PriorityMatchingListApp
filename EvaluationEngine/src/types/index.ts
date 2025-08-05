export interface EvaluationRecord {
    id: string;
    candidateName: string;
    skill: string;
    score: number;
    date: Date;
}

export interface QuestionData {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
}