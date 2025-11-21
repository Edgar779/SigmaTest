import { Document } from 'mongoose';
import { IQuiz } from '../../quizzes/interface';

export interface IQuestion extends Document {
  quizId: IQuiz['_id'];
  question_text: string;
  options: string[];
  correct_option_index: number;
}