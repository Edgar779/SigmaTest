import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateQuizDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  timeLimitMinutes?: number;
}
