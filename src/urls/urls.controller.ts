/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, UseGuards, Req, Get, Put, Param, Delete } from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('URLs')
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encurta uma URL (login opcional)' })
  @ApiResponse({ status: 201, description: 'URL encurtada' })
  @ApiResponse({ status: 400, description: 'Alias inválido ou já utilizado' })
  @UseGuards(OptionalJwtAuthGuard)
  async shorten(@Body() dto: CreateUrlDto, @Req() req) {
    const userId = req.user?.userId ?? undefined;

    return this.urlsService.create({ originalUrl: dto.originalUrl, userId, alias: dto.alias });
  }

  @Get('my-urls')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista URLs do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async list(@Req() req) {
    const userId = req.user.userId;

    return await this.urlsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('my-urls/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza URL original' })
  @ApiResponse({ status: 200, description: 'URL atualizada' })
  @ApiResponse({ status: 403, description: 'URL não pertence ao usuário' })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove URL (soft delete)' })
  @ApiResponse({ status: 200, description: 'URL removida com sucesso' })
  @ApiResponse({ status: 403, description: 'URL não pertence ao usuário' })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  async remove(@Param('id') id: number, @Req() req) {
    await this.urlsService.softDelete({
      id,
      userId: req.user.userId,
    });

    return { message: 'URL removida com sucesso' };
  }
}
