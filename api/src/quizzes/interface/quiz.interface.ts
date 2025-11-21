import { Document } from 'mongoose';

export interface IQuiz extends Document {
  title: string;
  description: string;
  timeLimitMinutes: number;
}
