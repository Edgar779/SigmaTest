import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  password: string;
}
