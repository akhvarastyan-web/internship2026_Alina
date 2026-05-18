import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Photo } from './entities/photo.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { multerConfig } from '../config/multer.config';


@ApiTags('galleries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

@Post()
 @ApiOperation({ summary: 'Create gallery' })
@UseInterceptors(FilesInterceptor('files', 50, multerConfig))
create(
  @UploadedFiles() files: Express.Multer.File[],
  @Body() createGalleryDto: CreateGalleryDto,
  @Req() req: any
) {
  return this.galleriesService.create(createGalleryDto, files, req.user);
}

  @Get()
  @ApiOperation({ summary: 'Get all galleries' })
  async findAll(
  @Query('page') page: number = 1, 
  @Query('limit') limit: number = 21
) {
  return await this.galleriesService.findAll(+page, +limit);
}

  @Get(':id')
  @ApiOperation({ summary: 'Get gallery by ID' })
  findOne(@Param('id') id: string) {
    return this.galleriesService.findOne(+id);
  }

  @Get(':id/photos')
  @ApiOperation({ summary: 'Get photos of a specific gallery with pagination' })
  async getGalleryPhotos(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 21,
  ) {
    return await this.galleriesService.findPhotosByGallery(+id, +page, +limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gallery by ID' })
  @UseInterceptors(FilesInterceptor('files', 50, multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateGalleryDto: UpdateGalleryDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    return this.galleriesService.update(
      +id, 
      updateGalleryDto, 
      files, 
      req.user.id
    );
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete gallery by ID' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.galleriesService.remove(+id, req.user.id);
  }

  @Post(':id/photos')
  @ApiOperation({ summary: 'Upload photos into specific gallery' })
  @UseInterceptors(FilesInterceptor('files', 50, multerConfig))
  async uploadPhotos(
    @Param('id') id: string,
    @Body() uploadPhotoDto: { titles?: string[]; descriptions?: string[] },
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('You must upload at least one file');
    }

    const savedPhotos = await this.galleriesService.addPhoto(
    +id, 
    files, 
    uploadPhotoDto.titles || [], 
    uploadPhotoDto.descriptions || [], 
    req.user.id
   );

    return {
    message: `Successfully uploaded ${files.length} photos`,
    photos: savedPhotos,
   };
  }

  @Patch('photos/:photoId')
  @ApiOperation({ summary: 'Edit the title or description of a specific photo' })
  async updatePhoto(
    @Param('photoId') photoId: string,
    @Body() updateData: { title?: string; description?: string },
    @Req() req: any,
  ) {
    return await this.galleriesService.updatePhoto(+photoId, updateData, req.user.id);
  }

  @Delete('photos/:photoId')
  @ApiOperation({ summary: 'Delete a specific photo from the gallery' })
  async removePhoto(@Param('photoId') photoId: string, @Req() req: any) {
    await this.galleriesService.removePhoto(+photoId, req.user.id);
    return { message: 'Photo successfully deleted' };
  }
}
