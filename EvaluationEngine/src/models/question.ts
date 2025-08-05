export class Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;

    constructor(id: number, text: string, options: string[], correctAnswer: string) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
}