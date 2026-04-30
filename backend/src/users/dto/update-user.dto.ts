import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional()
  firstname?: string;

  @ApiPropertyOptional()
  lastname?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Password must contain at least 6 characters',
    minLength: 6,
  })
  password?: string;
}
