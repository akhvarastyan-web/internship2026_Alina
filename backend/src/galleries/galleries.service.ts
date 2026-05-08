import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './galleries.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) {}

  async create(createGalleryDto: CreateGalleryDto): Promise<Gallery> {
    const newGallery = this.galleryRepository.create(createGalleryDto);
    return await this.galleryRepository.save(newGallery);
  }

  async findAll(): Promise<Gallery[]> {
    return await this.galleryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOneBy({ id });
    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${id} not found`);
    }
    return gallery;
  }

  async update(id: number, updateGalleryDto: UpdateGalleryDto): Promise<Gallery> {
    const gallery = await this.findOne(id);
    const updated = Object.assign(gallery, updateGalleryDto);
    return await this.galleryRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const gallery = await this.findOne(id);
    await this.galleryRepository.remove(gallery);
  }
}
