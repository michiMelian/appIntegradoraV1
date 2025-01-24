import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @Matches(/^\d{10}$/, {
    message: 'El número de teléfono debe ser un número de 10 dígitos',
  })
  numero_telef: string;

  @IsNotEmpty()
  user: number;
}
