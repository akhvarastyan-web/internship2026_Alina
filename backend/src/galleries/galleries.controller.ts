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

@ApiTags('galleries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gallery' })
  create(@Body() createGalleryDto: CreateGalleryDto, @Req() req: any) {
    return this.galleriesService.create(createGalleryDto, req.user); 
  }

  @Get()
  @ApiOperation({ summary: 'Get all galleries' })
  async findAll(
  @Query('page') page: number = 1, 
  @Query('limit') limit: number = 10
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
    @Query('limit') limit: number = 20,
  ) {
    return await this.galleriesService.findPhotosByGallery(+id, +page, +limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gallery by ID' })
  update(
    @Param('id') id: string,
    @Body() updateGalleryDto: UpdateGalleryDto,
    @Req() req: any,
  ) {
    return this.galleriesService.update(+id, updateGalleryDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete gallery by ID' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.galleriesService.remove(+id, req.user.id);
  }

  @Post(':id/photos')
  @ApiOperation({ summary: 'Upload photos into specific gallery' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadPhotoDto })
  @UseInterceptors(
    FilesInterceptor('files', 50, { 
      storage: diskStorage({
        destination: './uploads/galleries',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            `gallery-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadPhotos(
    @Param('id') id: string,
    @Body() uploadPhotoDto: UploadPhotoDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('You must upload at least one file');
    }

    const savedPhotos: Photo[] = [];

    for (const file of files) {
      const fileUrl = `/uploads/galleries/${file.filename}`;
      const savedPhoto = await this.galleriesService.addPhoto(+id, uploadPhotoDto, fileUrl, req.user.id);
      savedPhotos.push(savedPhoto);
    }

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
