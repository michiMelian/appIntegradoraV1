import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Task } from 'src/modules/task/entities/task.entity';
import { Profile } from 'src/modules/profile/entities/profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  rol: string;

  @Column({ nullable: false })
  perfilld: string;

  @ManyToMany(() => Task, (task) => task.user)
  task: Task[];

  @ManyToOne(() => Profile, (perfil) => perfil.user, { cascade: true })
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAT: Date;
}
