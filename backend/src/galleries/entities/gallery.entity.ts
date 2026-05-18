import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Photo } from './photo.entity';
import { User } from '../../users/user.entity';
import { Image } from '../../images/image.entity';

@Entity('galleries')
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Photo, (photo) => photo.gallery, { cascade: true })
  photos: Photo[];

  @OneToMany(() => Image, (image) => image.gallery, { cascade: true })
  images: Image[];

  @ManyToOne(() => User, (user) => user.galleries, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
