import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from '../users/user.entity';
import { Request as ExpressRequest } from 'express';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Body,
  Get,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';

interface RequestWithUser extends ExpressRequest {
  user: User & { id: number };
}


@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
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
}
