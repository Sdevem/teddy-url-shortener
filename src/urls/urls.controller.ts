import { Controller, Post, Body, UseGuards, Req, Get, Put, Param } from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller()
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

  @Get('my-urls')
  @UseGuards(JwtAuthGuard)
  async list(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId;

    return await this.urlsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('my-urls/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateUrlDto, @Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId;

    return await this.urlsService.update({
      id: Number(id),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      userId,
      originalUrl: dto.originalUrl,
    });
  }
}
