import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { multerConfig } from '../config/multer.config';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@ApiTags('images')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('gallery/:galleryId')
  @ApiOperation({ summary: 'Upload images into specific gallery' })
  @UseInterceptors(FilesInterceptor('files', 50, multerConfig))
  async uploadImages(
    @Param('galleryId') galleryId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException(
        'You must upload at least one file',
      );
    }

    const images = await this.imagesService.uploadImages(
      +galleryId,
      files,
      req.user.id,
    );

    return {
      message: `Successfully uploaded ${files.length} images`,
      images,
    };
  }

  @Get('gallery/:galleryId')
  @ApiOperation({ summary: 'Get gallery images with pagination' })
  async getGalleryImages(
    @Param('galleryId') galleryId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 21,
  ) {
    return await this.imagesService.findImagesByGallery(
      +galleryId,
      +page,
      +limit,
    );
  }

  @Delete(':imageId')
  @ApiOperation({ summary: 'Delete image' })
  async removeImage(
    @Param('imageId') imageId: string,
    @Req() req: any,
  ) {
    await this.imagesService.removeImage(
      +imageId,
      req.user.id,
    );

    return {
      message: 'Image successfully deleted',
    };
  }

  @Patch(':imageId/move')
  @ApiOperation({ summary: 'Move image to another gallery' })
  async moveImage(
    @Param('imageId') imageId: string,
    @Body('targetGalleryId') targetGalleryId: number,
    @Req() req: any,
  ) {
    return await this.imagesService.moveImage(
      +imageId,
      +targetGalleryId,
      req.user.id,
    );
  }

  @Post(':imageId/copy')
  @ApiOperation({ summary: 'Copy image to another gallery' })
  async copyImage(
    @Param('imageId') imageId: string,
    @Body('targetGalleryId') targetGalleryId: number,
    @Req() req: any,
  ) {
    return await this.imagesService.copyImage(
      +imageId,
      +targetGalleryId,
      req.user.id,
    );
  }
}
