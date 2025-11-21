import { model, Schema, Types } from 'mongoose';
import { IQuizAttempt } from './interface';

export const QuizAttemptSchema = new Schema({
    quizId: { type: Types.ObjectId, ref: 'quiz', required: true },
    userId: { type: Types.ObjectId, ref: 'user', required: true },
    answers: [
      {
        questionId: { type: Types.ObjectId, ref: 'question', required: true },
        selectedIndex: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
      }
    ],
    score: { type: Number },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
  }, { timestamps: true });

  export const QuizAttemptModel = model<IQuizAttempt>('quizAttempt', QuizAttemptSchema);