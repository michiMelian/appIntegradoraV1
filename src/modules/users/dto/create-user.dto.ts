import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Task } from 'src/modules/task/entities/task.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserDto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  password: string;

  @IsString()
  rol: string;

  @IsString()
  perfilld: string;

  @IsNumber()
  readonly task: [];
}
