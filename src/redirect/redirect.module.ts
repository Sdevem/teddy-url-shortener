import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { UrlsModule } from '../urls/urls.module';

@Module({
  imports: [UrlsModule],
  controllers: [RedirectController],
})
export class RedirectModule {}
