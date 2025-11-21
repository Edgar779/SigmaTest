import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ArrayMinSize,
  IsInt,
  Min,
  Max,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

export class CreateQuestionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId({ message: 'quizId must be a valid MongoDB ObjectId' })
  quizId: string;
  @ApiProperty({
    description: 'The text of the question',
    example: 'What is 2 + 2?',
  })
  @IsString()
  question_text: string;

  @ApiProperty({
    description: 'Array of possible answer options',
    example: ['1', '2', '3', '4'],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'There must be at least 2 options' })
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    description: 'Index of the correct option in the options array',
    example: 3,
  })
  @IsInt()
  @Min(0)
  correct_option_index: number;
}
