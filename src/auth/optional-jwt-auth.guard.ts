import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user ?? null;
  }
}
