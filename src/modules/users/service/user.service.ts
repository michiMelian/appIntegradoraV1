import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entities';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

@Injectable()
export class UserService {
  createUser(createUserDto: CreateUserDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create({
        ...userDto,
        rol: userDto.rol || 'user',
        password: bcrypt.asynchash(userDto.password, 10),
      });

      await this.userRepository.save(newUser);

      return {
        message: 'Usuario creado exitosamente',
        data: newUser,
      };
    } catch (error) {
      console.error('Error al crear el Usuario:', error.message);
      throw new InternalServerErrorException('Error al crear el Usuario');
    }
  }

  async getNameofUserAndId() {
    try {
      return await this.userRepository
        .createQueryBuilder('User')
        .select(['User.email', 'User.id'])
        .getMany();
    } catch (error) {
      console.error('Error en getUser', error);
      throw new InternalServerErrorException('Error al obtener los Usuarios');
    }
  }

  async getUsers({ limit, offset }: PaginationQueryDto): Promise<User[]> {
    try {
      return await this.userRepository.find({
        skip: offset,
        take: limit,
      });
    } catch (error) {
      console.error('Error en getUser', error);
      throw new InternalServerErrorException('Error al obtener los Usuarios');
    }
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['task', 'profile'],
    });
    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  }
}
