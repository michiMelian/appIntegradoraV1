import * as dotenv from 'dotenv';
import { Injectable, UnauthorizedException, Req } from '@nestjs/common';
import { LoginUsuarioDto } from '../dto/loginusuario';
import { JwtService } from '@nestjs/jwt';
import { Request as ExpressRequest } from 'express';
import { User } from 'src/modules/users/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

dotenv.config();

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usuarioRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: any) {
    return await this.usuarioRepository.findOne({
      where: { username: payload.sub },
    });
  }

  async login(user: LoginUsuarioDto) {
    const payload = { user: user.email };

    const userBD = await this.usuarioRepository.findOne({
      where: { email: payload.user },
    });
    console.log(userBD);

    if (!userBD || user.password != userBD.password)
      throw new UnauthorizedException('Credenciales Invadiados');

    const token = {
      token: this.jwtService.sign(payload, {
        secret: process.env.AUTH_TOKEN,
      }),
    };
    return token;
  }

  async verifyToken(token: string) {
    try {
      const a = await this.jwtService.verify(token, {
        secret: process.env.AUTH_TOKEN,
      });
      return a;
    } catch (e) {
      throw new UnauthorizedException('Token Invalido');
    }
  }

  async getMe(@Req() req: RequestWithUser) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('Token Invalido');
    }
    const usuario = await this.usuarioRepository.findOne({
      where: { email: user.toString() },
    });
    const { password, ...result } = usuario;
    return result;
  }

  async getUserByToken(token: string): Promise<User> {
    return await this.jwtService.decode(token.split(' ')[1]);
  }
}
