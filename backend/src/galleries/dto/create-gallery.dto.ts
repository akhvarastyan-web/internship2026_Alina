import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty,
  IsOptional, 
  MinLength, 
  MaxLength,
 } from 'class-validator';

export class CreateGalleryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
