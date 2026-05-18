import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image } from './image.entity';
import { Gallery } from '../galleries/entities/gallery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Image,
      Gallery,
    ]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
