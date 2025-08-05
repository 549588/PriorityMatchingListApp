export class Evaluation {
    id: number;
    candidateName: string;
    skill: string;
    score: number;
    date: Date;

    constructor(id: number, candidateName: string, skill: string, score: number, date: Date) {
        this.id = id;
        this.candidateName = candidateName;
        this.skill = skill;
        this.score = score;
        this.date = date;
    }
}