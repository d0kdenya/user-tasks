import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  refreshToken: string;

  @Column({ type: 'integer', nullable: false })
  userId: number;

  @OneToOne(() => User, (user) => user.token, { nullable: false })
  @JoinColumn()
  user: User;
}
