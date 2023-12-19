import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm";
import { Token } from '../../token/entities/token.entity';
import { Task } from "../../task/entities/task.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  password: string;

  @OneToOne(() => Token, (token) => token.user)
  token: Token;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
