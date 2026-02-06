import { IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUrlDto {
  @IsUrl()
  @ApiPropertyOptional({
    example: 'https://nova-url.com',
    description: 'Nova URL original',
  })
  originalUrl: string;
}
