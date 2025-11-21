import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { SignedInDTO } from '../auth/dto';
import { MongooseUtil } from '../util';
import { IQuestion } from './interface';
import { CreateQuestionDTO, QuestionDTO } from './dto';
import { QuizModel } from './question.model';

@Injectable()
export class QuestionService {
  constructor() {
    // private readonly sanitizer: QuizSanitizer,
    this.model = QuizModel;
    this.mongooseUtil = new MongooseUtil();
  }
  private model: Model<IQuestion>;
  private mongooseUtil: MongooseUtil;

  /** Service API */
  /** Used for creating a new user in the system with email and password. @throws if the email is a duplica*/
  async create(dto: CreateQuestionDTO): Promise<IQuestion> {
    try {
      const question = new this.model({
        quizId: dto.quizId,
        question_text: dto.question_text,
        options: dto.options,
        correct_option_index: dto.correct_option_index,
      });
      await question.save();
      return question;
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, 'Question already exists');
      throw err;
    }
  }

  /** Get questions by quizId */
  async getAll(quizId: string): Promise<IQuestion[]> {
    const questions = await this.model.find({ quizId });
    this.checkQuestion(questions);
    return questions;
  }

  /** Private Methods */
  /** Chack if the question was found */
  private checkQuestion(question: IQuestion | IQuestion[]) {
    if (Array.isArray(question)) {
      if (question.length === 0) {
        throw new HttpException('No questions found', HttpStatus.NOT_FOUND);
      }
      return;
    }

    // TS now knows: question is IQuestion
    if (!question || Object.keys(question).length === 0) {
      throw new HttpException(
        'No such question was found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
