import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(+userId, null);
  }

  async refreshTokens(token: string) {
    if (!token) throw new UnauthorizedException('Refresh token missing');

    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, { 
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findOne(payload.sub);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokenMatches = await bcrypt.compare(token, user.hashedRefreshToken);
    if (!tokenMatches) throw new UnauthorizedException('Access Denied');

    const newPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(newPayload, { expiresIn: '15m' });
    const refreshToken = await this.jwtService.signAsync(newPayload, { expiresIn: '7d' });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefresh);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await this.usersService.saveResetToken(user.id, resetToken, tokenExpiry);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByResetToken(token);
    if (!user || !user.resetTokenExpiry) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    if (new Date() > user.resetTokenExpiry) {
      throw new BadRequestException('Token has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePasswordAndClearToken(user.id, hashedPassword);
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid current (old) password');
    }

    await this.usersService.update(userId, { password: dto.newPassword });
  }

  
}
