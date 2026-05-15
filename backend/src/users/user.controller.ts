import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from '../users/user.entity';
import { Request as ExpressRequest } from 'express';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Body,
  Get,
  UseGuards,
  Request,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Inject, 
  forwardRef,
} from '@nestjs/common';

interface RequestWithUser extends ExpressRequest {
  user: User & { id: number };
}

const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};


@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}


   @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile by token' })
    @ApiResponse({
      status: 200,
      description: 'User profile returned successfully',
      type: User,
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized - invalid or missing token',
    })
    getProfile(@Request() req: RequestWithUser): User {
      return req.user;
    }



  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile name/lastname' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid names provided',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.id;
    const filePath = `/uploads/${file.filename}`;
    
    await this.usersService.updateAvatar(userId, filePath);
    return { message: 'Avatar updated successfully', avatarUrl: filePath };
  }

  @Post('upload-background')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('background', multerConfig))
  async uploadBackground(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.id;
    const filePath = `/uploads/${file.filename}`;
    await this.usersService.updateBackground(userId, filePath);
    return {
      message: 'Background updated successfully',
      backgroundUrl: filePath,
    };
  }
}
