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
              findFirst: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(UrlsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  it('should return originalUrl and increment accessCount', async () => {
    (prisma.url.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
      originalUrl: 'https://google.com',
      deletedAt: null,
    });

    (prisma.url.update as jest.Mock).mockResolvedValue({});

    const result = await service.findBySlugAndIncrement('abc123');

    expect(prisma.url.findFirst).toHaveBeenCalledWith({
      where: {
        slug: 'abc123',
        deletedAt: null,
      },
    });

    expect(prisma.url.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        accessCount: { increment: 1 },
      },
    });

    expect(result?.originalUrl).toBe('https://google.com');
  });

  it('should return null when url does not exist', async () => {
    (prisma.url.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await service.findBySlugAndIncrement('not-found');

    expect(result).toBeNull();
    expect(prisma.url.update).not.toHaveBeenCalled();
  });
});
