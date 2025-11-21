import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { AuthGuard } from '../auth/guards';
import { IQuestion } from './interface';
import { CreateQuestionDTO } from './dto';

describe('QuestionController', () => {
  let controller: QuestionController;
  let service: QuestionService;

  // Mock service
  const mockQuestionService = {
    create: jest.fn(),
    getAll: jest.fn(),
  };

  // Fake guard result (always allow)
  const mockAuthGuard = { canActivate: () => true };
  const mockRolesGuard = { canActivate: () => true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        { provide: QuestionService, useValue: mockQuestionService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<QuestionController>(QuestionController);
    service = module.get<QuestionService>(QuestionService);
  });

  afterEach(() => jest.clearAllMocks());

  // ---------------------------
  // TEST: CREATE QUESTION
  // ---------------------------
  it('should create a question', async () => {
    const dto: CreateQuestionDTO = {
      quizId: '675f1ab13477772f9c7b1234',
      question_text: 'What is Node.js?',
      options: ['runtime', 'browser', 'framework'],
      correct_option_index: 2
    };

    const expected: IQuestion = {
      _id: '123',
      ...dto,
    } as any;

    mockQuestionService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(result).toEqual(expected);
    expect(mockQuestionService.create).toHaveBeenCalledWith(dto);
  });

  // ---------------------------
  // TEST: GET ALL QUESTIONS
  // ---------------------------
  it('should get all questions by quizId', async () => {
    const quizId = '675f1ab13477772f9c7b1111';
    const fakeQuestions: IQuestion[] = [
      { _id: '1', question_text: 'Q1', quizId } as any,
      { _id: '2', question_text: 'Q2', quizId } as any,
    ];

    mockQuestionService.getAll.mockResolvedValue(fakeQuestions);

    const result = await controller.getAll(quizId);

    expect(result).toEqual(fakeQuestions);
    expect(mockQuestionService.getAll).toHaveBeenCalledWith(quizId);
  });
});