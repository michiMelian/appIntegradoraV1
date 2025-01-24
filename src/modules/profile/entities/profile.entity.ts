import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entities';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @OneToOne(() => User, (user) => user.profile, { nullable: false })
  user: User;
}
