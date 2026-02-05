import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { UrlsService } from '../urls/urls.service';
import type { Response } from 'express';
@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get('redirect/:short')
  async redirect(@Param('short') slug: string, @Res() res: Response) {
    const url = await this.urlsService.findBySlugAndIncrement(slug);

    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }

    return res.redirect(url.originalUrl);
  }
}
