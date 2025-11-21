import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ACCESS_TOKEN, ParseObjectIdPipe } from '../util';
import { QuestionDTO, CreateQuestionDTO } from './dto';
import { QuestionService } from './question.service';
import { IQuestion } from './interface';
import { AuthGuard } from '../auth/guards';
import { Role } from '../auth/constants';
import { Roles } from '../decorators/roles.decorator';

@Controller('questions')
@ApiTags('Question Endpoints')
@ApiHeader({ name: ACCESS_TOKEN })
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /** Create the question */
  @Post()
  @ApiBody({ type: CreateQuestionDTO })
  @ApiOkResponse({ type: QuestionDTO })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateQuestionDTO): Promise<IQuestion> {
    const question = await this.questionService.create(dto);
    return question;
  }

  /** Get all questions */
  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiOkResponse({ type: [QuestionDTO] })
  async getAll(
    @Query('quizId', ParseObjectIdPipe) quizId: string,
  ): Promise<IQuestion[]> {
    const questions = await this.questionService.getAll(quizId);
    return questions;
  }
}
/** End of Controller */
