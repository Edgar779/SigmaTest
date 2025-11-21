import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { AuthGuard } from '../auth/guards';
import { IQuiz } from './interface';
import { CreateQuizDTO, EditQuizDTO, SubmitQuizDTO } from './dto';

describe('QuizController', () => {
  let controller: QuizController;
  let service: QuizService;

  // Mock QuizService
  const mockQuizService = {
    create: jest.fn(),
    submitQuiz: jest.fn(),
    scoreQuizzes: jest.fn(),
    edit: jest.fn(),
    startQuiz: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
  };

  // Fake guards
  const mockAuthGuard = { canActivate: () => true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        { provide: QuizService, useValue: mockQuizService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<QuizController>(QuizController);
    service = module.get<QuizService>(QuizService);
  });

  afterEach(() => jest.clearAllMocks());

  // ============================================================
  // TEST: CREATE QUIZ
  // ============================================================
  it('should create a quiz', async () => {
    const dto: CreateQuizDTO = {
      title: 'Backend Quiz',
      description: 'Test your Node.js knowledge',
    };

    const expected: IQuiz = { _id: '1', ...dto } as any;

    mockQuizService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(result).toEqual(expected);
    expect(mockQuizService.create).toHaveBeenCalledWith(dto);
  });

  // ============================================================
  // TEST: SUBMIT QUIZ
  // ============================================================
  it('should submit a quiz', async () => {
    const dto: SubmitQuizDTO = {
        quizId: '675f1ab13477772f9c7b1234',
        attemptId: '675f1ab13477772f9c7b4444',
        answers: [
          { questionId: '675f1ab13477772f9c7baa11', selectedIndex: 1 },
          { questionId: '675f1ab13477772f9c7baa22', selectedIndex: 0 },
        ],
      };

    const req: any = { user: { id: 'USER123' } };

    const expected = { score: 85 };

    mockQuizService.submitQuiz.mockResolvedValue(expected);

    const result = await controller.submitQuiz(dto, req);

    expect(result).toEqual(expected);
    expect(mockQuizService.submitQuiz).toHaveBeenCalledWith('USER123', dto);
  });

  // ============================================================
  // TEST: SCORE QUIZZES
  // ============================================================
  it('should return score quizzes', async () => {
    const req: any = { user: { id: 'USER123' } };

    const expected = [{ quizId: '1', score: 78 }];

    mockQuizService.scoreQuizzes.mockResolvedValue(expected);

    const result = await controller.scoreQuizzes(req);

    expect(result).toEqual(expected);
    expect(mockQuizService.scoreQuizzes).toHaveBeenCalledWith('USER123');
  });

  // ============================================================
  // TEST: EDIT QUIZ
  // ============================================================
  it('should edit a quiz', async () => {
    const id = 'QUIZ123';

    const dto: EditQuizDTO = {
      title: 'Updated Title',
      description: 'Updated Description',
    };

    const expected = { _id: id, ...dto };

    mockQuizService.edit.mockResolvedValue(expected);

    const result = await controller.editMenu(id, dto);

    expect(result).toEqual(expected);
    expect(mockQuizService.edit).toHaveBeenCalledWith(id, dto);
  });

  // ============================================================
  // TEST: START QUIZ
  // ============================================================
  it('should start a quiz', async () => {
    const req: any = { user: { id: 'USER123' } };
    const id = 'QUIZ_ID';

    const expected = [{ questionId: 'Q1' }];

    mockQuizService.startQuiz.mockResolvedValue(expected);

    const result = await controller.startQuiz(req, id);

    expect(result).toEqual(expected);
    expect(mockQuizService.startQuiz).toHaveBeenCalledWith('USER123', id);
  });

  // ============================================================
  // TEST: GET QUIZ BY ID
  // ============================================================
  it('should get quiz by id', async () => {
    const id = 'QUIZ123';

    const expected = { _id: id, title: 'Quiz 1' };

    mockQuizService.getById.mockResolvedValue(expected);

    const result = await controller.getQuizById(id);

    expect(result).toEqual(expected);
    expect(mockQuizService.getById).toHaveBeenCalledWith(id);
  });

  // ============================================================
  // TEST: GET ALL QUIZZES
  // ============================================================
  it('should get all quizzes', async () => {
    const expected = [
      { _id: '1', title: 'Quiz A' },
      { _id: '2', title: 'Quiz B' },
    ];

    mockQuizService.getAll.mockResolvedValue(expected);

    const result = await controller.getAll();

    expect(result).toEqual(expected);
    expect(mockQuizService.getAll).toHaveBeenCalled();
  });
});