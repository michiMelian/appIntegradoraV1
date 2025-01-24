import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../service/auth.service';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const user2 = await this.authService.verifyToken(
        request.headers.authorization.split(' ')[1],
      );
      if (!user2) {
        throw new UnauthorizedException(`El usuario ${user2} no existe`);
      }
      const usuario = await this.usuarioRepository.findOne({
        where: { email: user2.user },
      });

      return requiredRoles.includes(usuario.rol);
    }
    return false;
  }
}
