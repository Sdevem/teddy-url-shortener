import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UrlsModule } from './urls/urls.module';
import { RedirectController } from './redirect/redirect.controller';
import { RedirectModule } from './redirect/redirect.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, UrlsModule, RedirectModule],
  controllers: [AppController, RedirectController],
  providers: [AppService],
})
export class AppModule {}
