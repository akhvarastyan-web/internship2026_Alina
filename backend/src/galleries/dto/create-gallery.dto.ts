import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
=======
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
>>>>>>> 6e7383bc590d8a347a80cdf6c5d5312969eef90a

export class CreateGalleryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
<<<<<<< HEAD
=======
  @MinLength(2)
  @MaxLength(50)
>>>>>>> 6e7383bc590d8a347a80cdf6c5d5312969eef90a
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> 6e7383bc590d8a347a80cdf6c5d5312969eef90a
