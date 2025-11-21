import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DTO } from 'src/util';
import { Role } from '../../auth/constants';

export class CreateAuthDTO extends DTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @MinLength(8)
  @MaxLength(30)
  password: string;
  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}
