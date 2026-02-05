import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return (await bcrypt.hash(password, SALT_ROUNDS)) as string;
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return (await bcrypt.compare(plain, hashed)) as boolean;
}
