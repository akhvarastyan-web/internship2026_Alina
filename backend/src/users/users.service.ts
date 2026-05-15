import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: RegisterDto): Promise<User> {
    console.log('dto:', dto);
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    console.log('existingUser:', existingUser);

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

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email !== undefined) {
      const emailOwner = await this.usersRepository.findOne({
        where: { email: dto.email },
      });
      if (emailOwner && emailOwner.id !== id) {
        throw new ConflictException(
          'Email is already in use by another account',
        );
      }
    }

    if (dto.password !== undefined) {
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async updateRefreshToken(
    id: number,
    hashedRefreshToken: string,
  ): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.hashedRefreshToken = hashedRefreshToken;

    await this.usersRepository.save(user);
  }

async saveResetToken(id: number, token: string, expiry: Date): Promise<void> {
  const user = await this.findOne(id);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  user.resetToken = token;
  user.resetTokenExpiry = expiry;

  await this.usersRepository.save(user);
}

async findByResetToken(token: string): Promise<User | null> {
  return this.usersRepository.findOne({
    where: { resetToken: token },
  });
}

  async updatePasswordAndClearToken(
    id: number,
    hashedPassword: string,
  ): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await this.usersRepository.save(user);
}
}
