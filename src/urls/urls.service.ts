import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateSlug } from './slug.util';

const RESERVED_ALIASES = [
  'auth',
  'auth/login',
  'login',
  'register',
  'users',
  'urls',
  'shorten',
  'redirect',
  'health',
  'docs',
  'swagger',
];

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(urlDto: { originalUrl: string; userId: string | undefined; alias?: string }) {
    const { originalUrl, userId, alias } = urlDto;

    if (alias && !userId) {
      throw new ForbiddenException(
        'Alias personalizado permitido apenas para usuários autenticados',
      );
    }

    let slug: string;

    if (alias) {
      const normalizedAlias = alias.toLowerCase();

      if (RESERVED_ALIASES.includes(normalizedAlias)) {
        throw new BadRequestException('Alias reservado pelo sistema');
      }

      const exists = await this.prisma.url.findUnique({
        where: { slug: normalizedAlias },
      });

      if (exists) {
        throw new BadRequestException('Alias já está em uso');
      }

      slug = normalizedAlias;
    } else {
      // 🔁 slug automático: tenta até achar um válido
      slug = generateSlug();

      while (
        await this.prisma.url.findUnique({
          where: { slug },
        })
      ) {
        slug = generateSlug();
      }
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

  async findByUser(userId: string) {
    return this.prisma.url.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        slug: true,
        accessCount: true,
        originalUrl: true,
        createdAt: true,
      },
    });
  }

  async update(urlDto: { id: number; userId: string; originalUrl: string }) {
    const { id, userId, originalUrl } = urlDto;

    const url = await this.prisma.url.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('Acesso não autorizado');
    }

    return this.prisma.url.update({
      where: { id },
      data: {
        originalUrl: originalUrl,
      },
      select: {
        id: true,
        slug: true,
        originalUrl: true,
        updatedAt: true,
      },
    });
  }

  async softDelete(urlDto: { id: number; userId: string }) {
    const { id, userId } = urlDto;

    const url = await this.prisma.url.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
    });

    if (!url) {
      throw new NotFoundException('URL não encontrada');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('Acesso não autorizado');
    }

    await this.prisma.url.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findBySlugAndIncrement(slug: string) {
    const url = await this.prisma.url.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });

    if (!url) return null;

    await this.prisma.url.update({
      where: { id: url.id },
      data: {
        accessCount: {
          increment: 1,
        },
      },
    });

    return url;
  }
}
