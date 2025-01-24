import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from 'src/modules/task/dto';

export class UpdateUserDto extends PartialType(CreateTaskDto) {}
