import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Gallery } from './gallery.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  url: string;

  @ManyToOne(() => Gallery, (gallery) => gallery.photos, {
    onDelete: 'CASCADE',
  })
  gallery: Gallery;

  @CreateDateColumn()
  createdAt: Date;
}
