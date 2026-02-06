import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@email.com',
    description: 'Email do usuário',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
  })
  password: string;
}
