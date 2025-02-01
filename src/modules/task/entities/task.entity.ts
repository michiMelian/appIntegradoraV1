import { User } from 'src/modules/users/entities';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column('timestamp') // Asegúrate de usar el tipo correcto para la fecha
  fechadv: string;

  @Column()
  estado: string;

  @ManyToOne(() => User, (user) => user.task, { onDelete: 'SET NULL' })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.task, { cascade: true })
  tag: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
