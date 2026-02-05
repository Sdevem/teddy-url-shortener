import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateSlug } from './slug.util';

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(urlDto: { originalUrl: string; userId: string | undefined }) {
    const { originalUrl, userId } = urlDto;

    let slug = generateSlug();

    // garante unicidade
    while (await this.prisma.url.findUnique({ where: { slug } })) {
      slug = generateSlug();
    }

    return this.prisma.url.create({
      data: {
        originalUrl,
        slug,
        userId,
      },
      select: {
        id: true,
        slug: true,
        userId: true,
        originalUrl: true,
        createdAt: true,
      },
    });
  }
}
