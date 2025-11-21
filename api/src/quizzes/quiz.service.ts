import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { MongooseUtil } from '../util';
import { IQuiz, IQuizAttempt } from './interface';
import { CreateQuizDTO, EditQuizDTO, SubmitQuizDTO } from './dto';
import { QuizModel } from './quiz.model';
import { QuestionService } from '../questions/question.service';
import { QuizAttemptModel } from './quizAttempt.model';

@Injectable()
export class QuizService {
  constructor(private readonly questionService: QuestionService) {
    // private readonly sanitizer: QuizSanitizer,
    this.model = QuizModel;
    this.attemptModel = QuizAttemptModel;
    this.mongooseUtil = new MongooseUtil();
  }
  private model: Model<IQuiz>;
  private attemptModel: Model<IQuizAttempt>;
  private mongooseUtil: MongooseUtil;

  /** Service API */
  /** Used for creating a new quiz in the system with title and description. @throws if the title is a duplica*/
  async create(dto: CreateQuizDTO): Promise<IQuiz> {
    try {
      const quiz = new this.model({
        title: dto.title,
        description: dto.description,
        timeLimitMinutes: dto.timeLimitMinutes,
      });
      await quiz.save();
      return quiz;
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, 'Quiz already exists');
      throw err;
    }
  }

  /** Start quiz: fetch questions without correct answers */
  async startQuiz(userId: string, id: string) {
    const quiz = await this.model.findById(id);
    this.checkQuiz(quiz);
    const questions = await this.questionService.getAll(id);
    // Create quiz attempt (empty for now)
    const attempt = new this.attemptModel({
      userId,
      quizId: id,
      answers: [],
      score: null,
      startedAt: new Date(),
      finishedAt: null,
    });
    await attempt.save();
    return {
      attemptId: attempt._id.toString(),
      id,
      timeLimitMinutes: quiz.timeLimitMinutes,
      questions: questions.map((q) => ({
        questionId: q._id.toString(),
        question_text: q.question_text,
        options: q.options,
      })),
    };
  }

  /** Submit quiz */
  async submitQuiz(userId: string, submitDto: SubmitQuizDTO) {
    const { quizId, attemptId, answers } = submitDto;
    const quiz = await this.model.findById({ _id: quizId });
    this.checkQuiz(quiz);
    const attemptQuiz = await this.attemptModel.findOne({
      _id: attemptId,
      userId,
      quizId,
    });
    this.checkAttemptQuiz(attemptQuiz);
    const questions = await this.questionService.getAll(quizId);
    // ===== TIME LIMIT CHECK =====
    if (quiz.timeLimitMinutes > 0) {
      const now = new Date();
      const deadline = new Date(
        attemptQuiz.startedAt.getTime() + quiz.timeLimitMinutes * 60_000,
      );

      if (now > deadline) {
        throw new BadRequestException('Time is over');
      }
    }

    // ===== CHECK ANSWERS =====

    let score = 0;
    const answersWithCorrectness = answers.map((a) => {
      const q = questions.find((q) => q._id.toString() === a.questionId);
      if (!q) throw new BadRequestException('Invalid question');

      const isCorrect = q.correct_option_index === a.selectedIndex;
      if (isCorrect) score++;

      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        isCorrect,
      };
    });

    // ===== SAVE ATTEMPT =====
    attemptQuiz.score = score;
    attemptQuiz.finishedAt = new Date();
    attemptQuiz.answers = answersWithCorrectness;
    await attemptQuiz.save();

    // ===== RESPONSE =====
    return {
      score,
      total: questions.length,
      answers: answersWithCorrectness.map((a) => ({
        questionId: a.questionId,
        isCorrect: a.isCorrect,
      })),
    };
  }

  /** Score quizzes */
  async scoreQuizzes(userId: string): Promise<IQuizAttempt[]> {
    const attemptQuizz = await this.attemptModel
      .find({ userId })
      .populate('answers.questionId');
    return attemptQuizz;
  }

  /** edit the quiz */
  async edit(_id: string, dto: EditQuizDTO): Promise<IQuiz> {
    try {
      const quiz = await this.model.findById(_id);
      this.checkQuiz(quiz);
      if (dto.title) quiz.title = dto.title;
      if (dto.description) quiz.description = dto.description;
      await quiz.save();
      return quiz;
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, 'Quiz with this title exists');
      throw err;
    }
  }

  /** Get all quizzes */
  async getAll(): Promise<IQuiz[]> {
    const questions = await this.model.find({});
    return questions;
  }

  /** get quiz by id */
  async getById(_id: string): Promise<IQuiz> {
    const quiz = await this.model.findById(_id);
    this.checkQuiz(quiz);
    return quiz;
  }

  /** Private Methods */
  /** Chack if the quiz was found */
  private checkQuiz(quiz: IQuiz) {
    if (!quiz) {
      throw new HttpException('No such quiz was found', HttpStatus.NOT_FOUND);
    }
  }
  /** Chack if the attempt quiz was found */
  private checkAttemptQuiz(attemptQuiz: IQuizAttempt) {
    if (!attemptQuiz) {
      throw new HttpException(
        'No such attempt quiz was found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
