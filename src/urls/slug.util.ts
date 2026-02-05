import { randomBytes } from 'crypto';

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateSlug(length = 6): string {
  const bytes = randomBytes(length);
  return Array.from(bytes)
    .map((b) => BASE62[b % 62])
    .join('');
}
