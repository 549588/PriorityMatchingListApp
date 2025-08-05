export class EvaluationService {
    handleEvaluation(questions: any[], answers: any[]): number {
        let score = 0;
        // answers can be array of strings or array of {id, answer}
        // Build a map from question id to answer
        let answerMap: Record<string, string> = {};
        if (answers.length && typeof answers[0] === 'object' && 'id' in answers[0]) {
            answers.forEach((a: any) => {
                answerMap[a.id] = a.answer;
            });
        } else {
            // If just array of strings, assume order matches questions
            questions.forEach((q, i) => {
                answerMap[q.id] = answers[i];
            });
        }
        questions.forEach((question) => {
            if (question.correctAnswer === answerMap[question.id]) {
                score++;
            }
        });
        return score;
    }

    processScore(score: number, totalQuestions: number): string {
        const percentage = (score / totalQuestions) * 100;
        return `Score: ${score}/${totalQuestions} (${percentage.toFixed(2)}%)`;
    }
}