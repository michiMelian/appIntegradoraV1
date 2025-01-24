import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { User } from '../users/entities';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { AuthService } from '../auth/service/auth.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  notificationService: any;
  constructor(
    @InjectRepository(Task)
    private readonly TaskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async createTask(createTask: CreateTaskDto, headers) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: createTask.user },
      });

      if (!user) {
        throw new ConflictException(
          `El usuario con ID ${createTask.user} no existe`,
        );
      }

      const user1: any = await this.authService.getUserByToken(
        headers.authorization,
      );
      const userEmail: string = user1.user;

      if (userEmail !== user.email) {
        throw new UnauthorizedException(`No tiene permiso para esta acción`);
      }

      const Task = this.TaskRepository.create({
        titulo: createTask.titulo,
        descripcion: createTask.descripcion,
        fechadv: createTask.fechadv,
        estado: createTask.estado,
        user: user,
      });

      await this.TaskRepository.save(Task);
      return {
        message: 'Tarea creada exitosamente',
        data: Task,
      };
    } catch (error) {
      console.error('Error al crear la Tarea:', error.message);
      throw new InternalServerErrorException('Error al crear la Tarea');
    }
  }

  async getTasksCercanas(dias: number): Promise<Task[]> {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + dias);

      return await this.TaskRepository.find({
        where: {
          fechadv: Between(today, futureDate),
        },
        relations: ['user'],
      });
    } catch (error) {
      console.error('Error al obtener Tarea cercanas a su vencimiento:', error);
      throw new InternalServerErrorException(
        'Error al obtener Tarea cercanas a su vencimiento',
      );
    }
  }

  async getNameofTaskAndId() {
    try {
      return await this.TaskRepository.createQueryBuilder('Task')
        .select(['Task.titulo', 'Task.id'])
        .getMany();
    } catch (error) {
      console.error('Error en getTask', error);
      throw new InternalServerErrorException('Error al obtener las Tarea');
    }
  }

  async getTasks({ limit, offset }: PaginationQueryDto): Promise<Task[]> {
    try {
      return await this.TaskRepository.find({
        relations: ['user'],
        skip: offset,
        take: limit,
      });
    } catch (error) {
      console.error('Error en getTasks', error);
      throw new InternalServerErrorException('Error al obtener las Tarea');
    }
  }

  async getTask(id: number): Promise<Task> {
    try {
      const Task = await this.TaskRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!Task) {
        throw new NotFoundException('Tarea no encontrada');
      }

      return Task;
    } catch (error) {
      console.error('Error en getTask', error);
      throw new InternalServerErrorException('Error al obtener la Tarea');
    }
  }

  async updateTask(id: number, updateTask: UpdateTaskDto) {
    try {
      const Task = await this.TaskRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!Task) {
        throw new NotFoundException('Tarea no encontrada');
      }

      Object.assign(Task, updateTask);

      await this.TaskRepository.save(Task);

      return {
        message: 'Tarea actualizada correctamente',
        data: Task,
      };
    } catch (error) {
      console.error('Error en updateTask', error);
      throw new InternalServerErrorException('Error al actualizar la Tarea');
    }
  }

  async removeTask(id: number) {
    try {
      const Task = await this.TaskRepository.findOne({
        where: { id },
      });

      if (!Task) {
        throw new NotFoundException('Tarea no encontrada');
      }

      await this.TaskRepository.remove(Task);

      return {
        message: 'Tarea eliminada correctamente',
      };
    } catch (error) {
      console.error('Error en removeTask', error);
      throw new InternalServerErrorException('Error al eliminar la Tarea');
    }
  }

  @Cron('0 0 * * *')
  async checkTasks(): Promise<void> {
    try {
      const days = 3;
      const tasks = await this.getTasksCloseToDueDate(days);

      if (!tasks.length) {
        console.log('No hay Tareas próximas a vencer en los próximos días.');
        return;
      }

      tasks.forEach((task) => {
        const user = task.user;
        if (!user || !user.email) {
          console.error(
            `La Tarea con ID ${task.id} no tiene un usuario asociado con un correo electrónico válido.`,
          );
          return;
        }

        const message = `La Tarea "${task.titulo}" está próxima a vencer el ${task.fechadv.toLocaleDateString()}.`;

        try {
          this.notificationService.sendEmail(
            user.email,
            'Recordatorio de Tarea',
            message,
          );
          this.notificationService.sendInternalNotification(user.id, message);
        } catch (notificationError) {
          console.error(
            `Error al enviar notificación para la Tarea con ID ${task.id}:`,
            notificationError.message,
          );
        }
      });
    } catch (error) {
      console.error(
        'Error al verificar Tarea próximas a vencer:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Ocurrió un error al verificar las Tareas próximas a vencer.',
      );
    }
  }

  async getTasksCloseToDueDate(days: number): Promise<Task[]> {
    try {
      const today = new Date();
      const upperLimit = new Date();
      upperLimit.setDate(today.getDate() + days);

      return await this.TaskRepository.find({
        where: {
          fechadv: Between(today, upperLimit),
        },
        relations: ['user'],
      });
    } catch (error) {
      console.error(
        'Error al obtener las Tareas próximas a vencer:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las Tareas próximas a vencer.',
      );
    }
  }
}
