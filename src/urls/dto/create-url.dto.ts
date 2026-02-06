import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @IsUrl()
  @ApiProperty({
    example: 'https://google.com',
    description: 'URL original a ser encurtada',
  })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiPropertyOptional({
    example: 'meu-alias',
    description: 'Alias customizado (somente para usuários autenticados)',
  })
  alias?: string;
}
