import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ConflictException,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationQueryDto } from './dto';
import { Task } from './entities/task.entity';
import { validationGlobal } from 'src/common/validation/validation.create';
import { validationUpdate } from 'src/common/validation/validation.update';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthService } from '../auth/service/auth.service';

@UseGuards(RolesGuard)
@Controller('task')
export class TaskController {
  constructor(
    private readonly TaskService: TaskService,
    private readonly authService: AuthService,
  ) {}

  @Roles('Administrador')
  @Post()
  async createTask(
    @Body() createTask: CreateTaskDto,
    @Headers() headers: Record<string, string>,
  ) {
    const Tasks = await this.TaskService.getNameofTaskAndId();
    const validation = validationGlobal(createTask.titulo, Tasks);
    if (validation) {
      throw new ConflictException(`Existe una Tarea con el mismo nombre`);
    }

    return await this.TaskService.createTask(createTask, headers);
  }

  @Roles('Administrador')
  @Get()
  async getTasks(@Query() pagination: PaginationQueryDto): Promise<Task[]> {
    return await this.TaskService.getTasks(pagination);
  }

  @Roles('Administrador')
  @Get(':id')
  async getTask(@Param('id') id: number): Promise<Task> {
    return await this.TaskService.getTask(id);
  }

  @Roles('Administrador')
  @Patch(':id')
  async updateTask(@Param('id') id: number, @Body() updateDto: UpdateTaskDto) {
    const TaskAactualizar: Task = await this.TaskService.getTask(id);
    const todosConnombreYid: Task[] =
      await this.TaskService.getNameofTaskAndId();
    const validation = validationUpdate(
      { name: TaskAactualizar.titulo, id: TaskAactualizar.id },
      todosConnombreYid as unknown as { name: string; id: number }[],
      updateDto,
    );
    if (validation) {
      throw new ConflictException(`Existe una Tarea con el mismo nombre`);
    }

    return await this.TaskService.updateTask(id, updateDto);
  }

  @Roles('Administrador')
  @Delete(':id')
  async removeTask(@Param('id') id: number) {
    return await this.TaskService.removeTask(id);
  }

  @Roles('Administrador')
  @Get('proximas-vencimiento/:dias')
  async getTasksCercanas(@Param('dias') dias: number): Promise<Task[]> {
    return await this.TaskService.getTasksCercanas(dias);
  }
}
