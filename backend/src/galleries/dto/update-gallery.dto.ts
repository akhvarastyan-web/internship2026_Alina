<<<<<<< HEAD
import { PartialType } from '@nestjs/swagger';
=======
import { PartialType } from '@nestjs/mapped-types';
>>>>>>> 6e7383bc590d8a347a80cdf6c5d5312969eef90a
import { CreateGalleryDto } from './create-gallery.dto';

export class UpdateGalleryDto extends PartialType(CreateGalleryDto) {}
