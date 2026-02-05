import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  alias?: string;
}
