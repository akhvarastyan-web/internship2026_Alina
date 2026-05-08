import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn 
} from 'typeorm';

@Entity('galleries')
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
