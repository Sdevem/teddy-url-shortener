import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { UrlsService } from '../urls/urls.service';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Redirect')
@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get('redirect/:short')
  @ApiOperation({
    summary: 'Redireciona para URL original',
    description:
      'Este endpoint retorna HTTP 302 (redirect). ' +
      'O Swagger UI não segue redirects por limitação de CORS. ' +
      'Use navegador, curl ou Postman para testar.',
  })
  @ApiResponse({ status: 302, description: 'Redirecionamento realizado' })
  @ApiResponse({ status: 404, description: 'Slug não encontrado' })
  async redirect(@Param('short') slug: string, @Res() res: Response) {
    const url = await this.urlsService.findBySlugAndIncrement(slug);

    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }

    return res.redirect(url.originalUrl);
  }
}
