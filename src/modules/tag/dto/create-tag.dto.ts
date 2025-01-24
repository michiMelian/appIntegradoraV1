import { IsNotEmpty, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateTagDto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
