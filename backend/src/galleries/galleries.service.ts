import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './entities/gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Photo } from './entities/photo.entity';
import { UploadPhotoDto } from './dto/upload-photo.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,

    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  private checkGalleryOwner(gallery: Gallery, userId: number): void {
    if (!gallery.user || gallery.user.id !== userId) {
      throw new ForbiddenException('You are not owner of this gallery');
    }
  }

  async create(createGalleryDto: CreateGalleryDto, user: any): Promise<Gallery> {
    const gallery = this.galleryRepository.create({
      ...createGalleryDto,
      user: user,
    });
    return await this.galleryRepository.save(gallery);
  }

  async findAll(page: number = 1, limit: number = 10) {
  const take = limit;
  const skip = (page - 1) * limit;

  const [items, total] = await this.galleryRepository.findAndCount({
    take: take,
    skip: skip,
    relations: ['user'],
    order: { createdAt: 'DESC' },
  });

  return {
    data: items,
    meta: {
      totalItems: total,
      itemCount: items.length,
      itemsPerPage: take,
      totalPages: Math.ceil(total / take),
      currentPage: page,
    },
  };
}

  async findOne(id: number): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOne({ 
      where: { id },
      relations: ['user'],
    });
    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${id} is not found`);
    }
    return gallery;
  }

  async findPhotosByGallery(galleryId: number, page: number = 1, limit: number = 20) {
    await this.findOne(galleryId);

    const take = limit;
    const skip = (page - 1) * limit;

    const [items, total] = await this.photoRepository.findAndCount({
      where: { gallery: { id: galleryId } },
      take: take,
      skip: skip,
      order: { id: 'DESC' },
    });

    return {
      data: items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: take,
        totalPages: Math.ceil(total / take),
        currentPage: page,
      },
    };
  }

  async update(id: number, updateGalleryDto: UpdateGalleryDto, userId: number): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!gallery)
      throw new NotFoundException(`Gallery with ID ${id} is not found`);

    this.checkGalleryOwner(gallery, userId);
    Object.assign(gallery, updateGalleryDto);
    return await this.galleryRepository.save(gallery);
  }

  async remove(id: number, userId: number): Promise<void> {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
      relations: ['user', 'photos']
    });
    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${id} is not found`);
    }

    this.checkGalleryOwner(gallery, userId);

    for (const photo of gallery.photos) {
      const filePath = join(__dirname, '..', '..', photo.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.galleryRepository.remove(gallery);
  }

  async addPhoto(
    galleryId: number,
    uploadPhotoDto: UploadPhotoDto,
    fileUrl: string,
    userId: number,
  ): Promise<Photo> {
    const gallery = await this.galleryRepository.findOne({
      where: { id: galleryId },
      relations: ['user'],
    });

    if (!gallery) throw new NotFoundException(`Gallery is not found`);
    
    this.checkGalleryOwner(gallery, userId);

    const photo = this.photoRepository.create({
      title: uploadPhotoDto.title,
      description: uploadPhotoDto.description,
      url: fileUrl,
      gallery: gallery,
    });

    return await this.photoRepository.save(photo);
  }

  async updatePhoto(
    photoId: number,
    updateData: { title?: string; description?: string },
    userId: number,
  ): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id: photoId },
      relations: ['gallery', 'gallery.user']
    });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${photoId} is not found`);
    }
    this.checkGalleryOwner(photo.gallery, userId);
    Object.assign(photo, updateData);
    return await this.photoRepository.save(photo);
  }

  async removePhoto(photoId: number, userId: number): Promise<void> {
    const photo = await this.photoRepository.findOne({ 
      where: { id: photoId }, 
      relations: ['gallery', 'gallery.user'] 
    });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${photoId} is not found`);
    }

    this.checkGalleryOwner(photo.gallery, userId);

    const filePath = join(__dirname, '..', '..', photo.url); 
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.photoRepository.remove(photo);
  }

}
