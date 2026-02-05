// src/common/logger/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }

  error(message: string, trace?: string) {
    console.error(`[ERROR] ${message}`);
    if (trace) console.error(trace);
  }

  warn(message: string) {
    console.warn(`[WARN] ${message}`);
  }
}
