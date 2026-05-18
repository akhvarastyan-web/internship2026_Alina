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

    const updateData = { ...dto };

    if (dto.password !== undefined) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      updateData.password = hashedPassword;
    }

    const updatedUser = {
      ...user,
      ...updateData,
    };

    return this.usersRepository.save(updatedUser);
  }

  async updateRefreshToken(
    id: number,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.hashedRefreshToken = hashedRefreshToken ?? undefined;

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

  async updateAvatar(userId: number, filePath: string): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    user.avatarUrl = filePath;
    return this.usersRepository.save(user);
  }

  async updateBackground(userId: number, filePath: string): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    user.backgroundUrl = filePath;
    return this.usersRepository.save(user);
  }
}
