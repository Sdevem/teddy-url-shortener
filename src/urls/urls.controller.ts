import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller()
@UseGuards(OptionalJwtAuthGuard)
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  @UseGuards(OptionalJwtAuthGuard)
  async shorten(@Body() dto: CreateUrlDto, @Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user?.userId ?? undefined;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return this.urlsService.create({ originalUrl: dto.originalUrl, userId, alias: dto.alias });
  }
}
