import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    description: 'Password must contain at least 6 characters',
    minLength: 6,
  })
  password: string;
}
