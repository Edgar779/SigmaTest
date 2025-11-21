import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ACCESS_TOKEN, IRequest, ParseObjectIdPipe, Public } from '../util';
import { CreateQuizDTO, EditQuizDTO, QuizDTO, SubmitQuizDTO } from './dto';
import { QuizService } from './quiz.service';
import { IQuiz } from './interface';
import { AuthGuard } from '../auth/guards';
import { Role } from '../auth/constants';
import { Roles } from '../decorators/roles.decorator';

@Controller('quizzes')
@ApiTags('Quiz Endpoints')
@ApiHeader({ name: ACCESS_TOKEN })
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  /** Create the quiz */
  @Post()
  @ApiBody({ type: CreateQuizDTO })
  @ApiOkResponse({ type: QuizDTO })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateQuizDTO): Promise<IQuiz> {
    const quiz = await this.quizService.create(dto);
    return quiz;
  }

  /** submit answers */
  @Patch('submit')
  @UseGuards(AuthGuard)
  @Roles(Role.USER)
  async submitQuiz(
    @Body() submitDto: SubmitQuizDTO,
    @Req() req: IRequest
  ) {
    return this.quizService.submitQuiz(req.user.id, submitDto);
  }

  /** score quizzes */
  @Get('score')
  @UseGuards(AuthGuard)
  @Roles(Role.USER)
  async scoreQuizzes(
    @Req() req: IRequest
  ) {
    return this.quizService.scoreQuizzes(req.user.id);
  }
  
  /** Update the quiz fields */
  @Patch(':id')
  @ApiBody({ type: EditQuizDTO })
  @ApiOkResponse({ type: QuizDTO })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  async editMenu(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: EditQuizDTO,
  ): Promise<IQuiz> {
    const quiz = await this.quizService.edit(id, dto);
    return quiz;
  }

  /** Start quiz: fetch questions without correct answers */
  @Patch(':id/start')
  @UseGuards(AuthGuard)
  @Roles(Role.USER)
  async startQuiz(@Req() req: IRequest, @Param('id') id: string) {
    return this.quizService.startQuiz(req.user.id, id);
  }

  /** Get quiz by id */
  @Get('id')
  @UseGuards(AuthGuard)
  @Roles(Role.USER)
  @ApiOkResponse({ type: [QuizDTO] })
  async getQuizById(
    @Query('id', ParseObjectIdPipe) id: string,
  ): Promise<IQuiz> {
    const quiz = await this.quizService.getById(id);
    return quiz;
  }

  /** Get all quiz */
  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.USER)
  @ApiOkResponse({ type: [QuizDTO] })
  async getAll(): Promise<IQuiz[]> {
    const quizzes = await this.quizService.getAll();
    return quizzes;
  }
}
/** End of Controller */
