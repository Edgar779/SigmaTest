import { ApiProperty } from '@nestjs/swagger';
import { IAuth } from '../../auth/interface';
import { IQuiz } from '../../quizzes/interface';

export class QuestionDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  question_text: string;
  @ApiProperty()
  quizId: IQuiz['_id'];
  @ApiProperty()
  options: string[];
  @ApiProperty()
  correct_option_index: number;
}