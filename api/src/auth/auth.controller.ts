import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDTO, SignedInDTO, SigninDTO } from './dto';

import { Public } from 'src/util';

@Controller('auth')
@ApiTags('Authentication Endpoints')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /** Create a new user */
  @Post()
  @Public()
  @ApiBody({ type: CreateAuthDTO })
  @ApiOkResponse({ type: SignedInDTO })
  async register(@Body() dto: CreateAuthDTO): Promise<SignedInDTO> {
    const auth = await this.authService.create(dto);
    return auth;
  }
  
  /** Sign in a user */
  @Post('signin')
  @Public()
  @ApiBody({ type: SigninDTO })
  @ApiOkResponse({ type: SignedInDTO })
  async login(@Body() signinDTO: SigninDTO): Promise<SignedInDTO> {
    const auth = await this.authService.signin(signinDTO);
    return auth;
  }
}
/** End of Controller */
