import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './user.entity';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';

interface RequestWithUser extends ExpressRequest {
  user: User & { id: number };
}

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login user and return JWT token' })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }
}
