import { Exclude } from 'class-transformer';
import { Gallery } from '../galleries/entities/gallery.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry?: Date;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  backgroundUrl?: string;
  
  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @OneToMany(() => Gallery, (gallery) => gallery.user)
  galleries: Gallery[];
}
