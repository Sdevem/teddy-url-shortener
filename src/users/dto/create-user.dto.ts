import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do usuário',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email único do usuário',
  })
  email: string;

  @MinLength(6)
  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
    minLength: 6,
  })
  password: string;
}
