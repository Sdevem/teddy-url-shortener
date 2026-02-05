import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('UrlsService', () => {
  let service: UrlsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: PrismaService,
          useValue: {
            url: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(UrlsService);
    prisma = module.get(PrismaService);
  });

  it('should generate slug when alias is not provided', async () => {
    (prisma.url.findUnique as jest.Mock).mockResolvedValue(null);

    (prisma.url.create as jest.Mock).mockResolvedValue({
      id: 1,
      slug: 'abc123',
      originalUrl: 'https://google.com',
    });

    const result = await service.create({
      originalUrl: 'https://google.com',
      userId: undefined,
    });

    expect(result.slug).toBeDefined();
  });

  it('should throw error if alias is reserved', async () => {
    await expect(
      service.create({
        originalUrl: 'https://google.com',
        alias: 'login',
        userId: 'user-1',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error if alias already exists', async () => {
    jest.spyOn(prisma.url, 'findUnique').mockResolvedValueOnce({ id: 1 } as any);

    await expect(
      service.create({
        originalUrl: 'https://google.com',
        alias: 'meu-alias',
        userId: 'user-123',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not allow alias without authenticated user', async () => {
    await expect(
      service.create({
        originalUrl: 'https://google.com',
        alias: 'custom',
        userId: undefined,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should allow alias for authenticated user', async () => {
    (prisma.url.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.url.create as jest.Mock).mockResolvedValue({
      id: 1,
      slug: 'meualias',
      originalUrl: 'https://google.com',
    });

    const result = await service.create({
      originalUrl: 'https://google.com',
      alias: 'meualias',
      userId: 'user-1',
    });

    expect(result.slug).toBe('meualias');
  });
});
