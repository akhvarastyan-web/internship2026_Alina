import { GalleriesService } from './galleries.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@ApiTags('Galleries')
@Controller('galleries')
@UseGuards(JwtAuthGuard)
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gallery' })
  create(@Body() createGalleryDto: CreateGalleryDto) {
    return this.galleriesService.create(createGalleryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all galleries' })
  findAll() {
    return this.galleriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gallery by ID' })
  findOne(@Param('id') id: string) {
    return this.galleriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gallery by ID' })
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleriesService.update(+id, updateGalleryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete gallery by ID' })
  remove(@Param('id') id: string) {
    return this.galleriesService.remove(+id);
  }
}
