import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { LoginUsuarioDto } from '../dto/loginusuario';
import { AuthService } from '../service/auth.service';
import { Request as ExpressRequest } from 'express';
import { User } from 'src/modules/users/entities';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async Login(@Body() loginDto: LoginUsuarioDto) {
    return await this.authService.login(loginDto);
  }

  @Get()
  async getMe(@Req() req: RequestWithUser) {
    return await this.authService.getMe(req);
  }
}
