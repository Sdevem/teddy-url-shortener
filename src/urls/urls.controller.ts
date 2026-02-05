/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, UseGuards, Req, Get, Put, Param, Delete } from '@nestjs/common';
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
    const userId = req.user?.userId ?? undefined;

    return this.urlsService.create({ originalUrl: dto.originalUrl, userId, alias: dto.alias });
  }

  @Get('my-urls')
  @UseGuards(JwtAuthGuard)
  async list(@Req() req) {
    const userId = req.user.userId;

    return await this.urlsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('my-urls/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateUrlDto, @Req() req) {
    const userId = req.user.userId;

    return await this.urlsService.update({
      id: Number(id),
      userId,
      originalUrl: dto.originalUrl,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('my-urls/:id')
  async remove(@Param('id') id: number, @Req() req) {
    await this.urlsService.softDelete({
      id,
      userId: req.user.userId,
    });

    return { message: 'URL removida com sucesso' };
  }
}
