import {
  IsBoolean,
  IsEnum,
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

  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  fechadv: number;

  @IsString()
  @IsEnum(['pendiente', 'en progreso', 'completada'])
  estado: string;

  @IsNumber()
  readonly user: number;

  @IsOptional()
  tag: number[];
}
