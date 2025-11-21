import { model, Schema, Types } from 'mongoose';
import { IQuestion } from './interface';

const questionSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: 'quiz', required: true }, // which quiz it belongs to
    question_text: { type: String, required: true },
    options: { type: [String], required: true },
    correct_option_index: { type: Number, required: true },
  },
  { timestamps: true },
);

export const QuizModel = model<IQuestion>('question', questionSchema);
