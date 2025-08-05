"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
class Question {
    constructor(id, text, options, correctAnswer) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
}
exports.Question = Question;
