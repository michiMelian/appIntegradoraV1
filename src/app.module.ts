import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Task } from './modules/task/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TagModule } from './modules/tag/tag.module';
import { User } from './modules/users/entities';
import { Profile } from './modules/profile/entities/profile.entity';
import { Tag } from './modules/tag/entities/tag.entity';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Task, User, Profile, Tag],
      // autoLoadEntities: true,
      synchronize: true,
    }),
    TaskModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    TagModule,
  ],
})
export class AppModule {}
