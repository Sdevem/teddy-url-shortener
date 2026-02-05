import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
  });

  it('should login successfully with valid credentials', async () => {
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: hashedPassword,
    } as any);

    const result = await authService.login({
      email: 'test@test.com',
      password,
    });

    expect(result).toHaveProperty('access_token');
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    const hashedPassword = await bcrypt.hash('correct-password', 10);

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: hashedPassword,
    } as any);

    await expect(
      authService.login({
        email: 'test@test.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user does not exist', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'notfound@test.com',
        password: '123456',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
