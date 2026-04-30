import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (!dto.firstname || dto.firstname.trim() === '') {
      throw new BadRequestException('Firstname is required');
    }
    dto.firstname = dto.firstname.trim();

    if (!dto.lastname || dto.lastname.trim() === '') {
      throw new BadRequestException('Lastname is required');
    }
    dto.lastname = dto.lastname.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = dto.email ? dto.email.trim() : '';
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      throw new BadRequestException('Invalid email format');
    }
    dto.email = cleanEmail;

    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestException(
        'Password must contain at least 6 characters',
      );
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = this.usersRepository.create({
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      password: hashedPassword,
    });

    try {
      await this.usersRepository.save(user);
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.firstname !== undefined) {
      if (dto.firstname.trim() === '') {
        throw new BadRequestException('Firstname cannot be empty');
      }
      dto.firstname = dto.firstname.trim();
    }

    if (dto.lastname !== undefined) {
      if (dto.lastname.trim() === '') {
        throw new BadRequestException('Lastname cannot be empty');
      }
      dto.lastname = dto.lastname.trim();
    }

    if (dto.email !== undefined) {
      const cleanEmail = dto.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        throw new BadRequestException('Invalid email format');
      }

      const emailOwner = await this.usersRepository.findOne({
        where: { email: cleanEmail },
      });

      if (emailOwner && emailOwner.id !== id) {
        throw new ConflictException(
          'Email is already in use by another account',
        );
      }
      dto.email = cleanEmail;
    }

    if (dto.password !== undefined) {
      if (dto.password.length < 6) {
        throw new BadRequestException(
          'Password must contain at least 6 characters',
        );
      }
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
