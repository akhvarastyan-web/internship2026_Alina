import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { Image } from './image.entity';
import { Gallery } from '../galleries/entities/gallery.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) {}

  private checkGalleryOwner(gallery: Gallery, userId: number): void {
    if (gallery.user.id !== userId) {
      throw new ForbiddenException('You do not have access to this gallery');
    }
  }

  async uploadImages(
    galleryId: number,
    files: Express.Multer.File[],
    userId: number,
  ): Promise<Image[]> {
    const gallery = await this.galleryRepository.findOne({
      where: { id: galleryId },
      relations: ['user'],
    });

    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${galleryId} not found`);
    }

    this.checkGalleryOwner(gallery, userId);

    const imageEntities = files.map((file) => {
      return this.imageRepository.create({
        path: `/uploads/images/${file.filename}`,
        originalFilename: file.originalname,
        gallery,
      });
    });

    return await this.imageRepository.save(imageEntities);
  }

  async findImagesByGallery(galleryId: number, page: number, limit: number) {
    const take = limit;
    const skip = (page - 1) * limit;

    const [items, total] =
      await this.imageRepository.findAndCount({
      where: { gallery: { id: galleryId } },
        relations: ['gallery'],
        take,
        skip,
        order: {
        createdAt: 'DESC',
        },
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

  async removeImage(imageId: number, userId: number): Promise<void> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
      relations: ['gallery', 'gallery.user'],
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    this.checkGalleryOwner(image.gallery, userId);

    const filePath = join(__dirname, '..', '..', image.path);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.imageRepository.remove(image);
  }

  async moveImage(
    imageId: number,
    targetGalleryId: number,
    userId: number,
  ): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
      relations: ['gallery', 'gallery.user'],
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    this.checkGalleryOwner(image.gallery, userId);

    const targetGallery =
      await this.galleryRepository.findOne({
        where: { id: targetGalleryId },
        relations: ['user'],
      });

    if (!targetGallery) {
      throw new NotFoundException(`Target gallery not found`);
    }

    this.checkGalleryOwner(targetGallery, userId);

    image.gallery = targetGallery;

    return await this.imageRepository.save(image);
  }

  async copyImage(
    imageId: number,
    targetGalleryId: number,
    userId: number,
  ): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
      relations: ['gallery', 'gallery.user'],
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    this.checkGalleryOwner(image.gallery, userId);

    const targetGallery =
      await this.galleryRepository.findOne({
        where: { id: targetGalleryId },
        relations: ['user'],
      });

    if (!targetGallery) {
      throw new NotFoundException(`Target gallery not found`);
    }

    this.checkGalleryOwner(targetGallery, userId);

    const copiedImage = this.imageRepository.create({
      path: image.path,
      originalFilename: image.originalFilename,
      gallery: targetGallery,
    });

    return await this.imageRepository.save(copiedImage);
  }
}
