import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/modules/users/entities';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateTaskDto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsString()
  fechadv: string;

  @IsString()
  @IsEnum(['pendiente', 'en progreso', 'completada'])
  estado: string;

  @IsNumber()
  readonly user: number;

  @IsOptional()
  tag: number[];
}
