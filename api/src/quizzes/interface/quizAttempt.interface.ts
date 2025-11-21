import { Document } from 'mongoose';

export interface IQuizAttempt extends Document {
  title: string;
  description: string;
  startedAt: Date;
  finishedAt: Date;
  score: number;
  answers: IAnswer[];
}

export interface IAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}
