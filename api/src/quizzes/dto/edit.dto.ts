import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class EditQuizDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
}
