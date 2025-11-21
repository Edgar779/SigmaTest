import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsMongoId,
  Min,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { DTO } from 'src/util';

export class AnswerItemDTO {
  @ApiProperty({ description: 'Question ID' })
  @IsMongoId()
  questionId: string;

  @ApiProperty({ description: 'Selected option index' })
  @IsNumber()
  @Min(0)
  selectedIndex: number;
}

export class SubmitQuizDTO {
  @ApiProperty({ description: 'Quiz ID' })
  @IsMongoId()
  quizId: string;
  @ApiProperty({ description: 'Attempt ID' })
  @IsMongoId()
  attemptId: string;
  @ApiProperty({ description: 'User answers', type: [AnswerItemDTO] })
  @IsArray()
  @ArrayMinSize(1)
  answers: AnswerItemDTO[];
}
