import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UploadPhotoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'array', 
    items: { type: 'string', format: 'binary' }, 
    description: 'Max 50 pictures (png, jpeg)' 
  })
  files: any[];
}
