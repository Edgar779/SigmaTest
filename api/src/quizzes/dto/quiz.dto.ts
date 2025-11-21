import { ApiProperty } from '@nestjs/swagger';

export class QuizDTO {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  timeLimitMinutes: number;
}
