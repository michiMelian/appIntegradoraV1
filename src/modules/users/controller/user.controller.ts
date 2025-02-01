import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
  ConflictException,
  Query,
} from '@nestjs/common';
import { UserService } from 'src/modules/users/service/user.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { validationGlobal } from 'src/common/validation/validation.create';
import { PaginationQueryDto } from '../dto';
import { User } from '../entities';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createTask: CreateUserDto,
    @Headers() headers: Record<string, string>,
  ) {
    const user = await this.userService.getNameofUserAndId();
    const validation = validationGlobal(createTask.email, user);
    if (validation) {
      throw new ConflictException(`Existe un Usuario con el mismo nombre`);
    }

    return await this.userService.create(createTask);
  }

  @Get()
  async getTasks(@Query() pagination: PaginationQueryDto): Promise<User[]> {
    return await this.userService.getUsers(pagination);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOneById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
