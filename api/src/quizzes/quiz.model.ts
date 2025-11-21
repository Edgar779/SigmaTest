import { model, Schema, Types } from 'mongoose';
import { IQuiz } from './interface';

const quizSchema = new Schema(
  {
    title: { type: String, unique: true },
    description: { type: String },
    // questions: { type: [QuestionSchema], default: [] },
    timeLimitMinutes: { type: Number, default: 0 }, // 0 = no limit
  },
  { timestamps: true },
);

export const QuizModel = model<IQuiz>('quiz', quizSchema);