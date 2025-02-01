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
  ParseIntPipe,
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

  @Roles('administrador')
  @Post()
  async createTask(
    @Body() createTask: CreateTaskDto,
    @Headers() headers: Headers,
  ) {
    const Tasks = await this.TaskService.getNameofTaskAndId();
    const validation = validationGlobal(createTask.titulo, Tasks);
    if (validation) {
      throw new ConflictException(`Existe una Tarea con el mismo nombre`);
    }

    return await this.TaskService.createTask(createTask, headers);
  }

  @Roles('administrador')
  @Get()
  async getTasks(@Query() pagination: PaginationQueryDto): Promise<Task[]> {
    return await this.TaskService.getTasks(pagination);
  }

  @Roles('administrador')
  @Get(':id')
  async getTask(@Param('id') id: number): Promise<Task> {
    return await this.TaskService.getTask(id);
  }

  @Roles('administrador')
  @Patch(':id')
  async updateFichaProfesional(
    @Param('id') id: number,
    @Body() updateDto: UpdateTaskDto,
  ) {
    console.log(id);

    const TaskAactualizar = await this.TaskService.getTask(id);
    const todosConnombreYid = await this.TaskService.getNameofTaskAndId();
    const validation = validationUpdate(
      TaskAactualizar,
      todosConnombreYid,
      updateDto,
    );
    if (validation) {
      throw new ConflictException(
        `Existe una ficha profesional el mismo nombre`,
      );
    }
    return await this.TaskService.updateTask(id, updateDto);
  }

  @Roles('administrador')
  @Delete(':id')
  async removeTask(@Param('id', ParseIntPipe) id: number) {
    return await this.TaskService.removeTask(id);
  }

  @Roles('administrador')
  @Get('proximas-vencimiento/:dias')
  async getTasksCercanas(@Param('dias') dias: number): Promise<Task[]> {
    return await this.TaskService.getTasksCercanas(dias);
  }
}
