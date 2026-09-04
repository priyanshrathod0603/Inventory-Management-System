import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it('should hash password with Argon2id', async () => {
    const rawPassword = 'SecurePassword123!';
    const hash = await service.hashPassword(rawPassword);

    expect(hash).toBeDefined();
    expect(hash).toMatch(/^\$argon2id\$/);
    expect(hash).not.toEqual(rawPassword);
  });

  it('should correctly verify valid password', async () => {
    const rawPassword = 'MySecretPassword!99';
    const hash = await service.hashPassword(rawPassword);

    const isValid = await service.verifyPassword(hash, rawPassword);
    expect(isValid).toBe(true);
  });

  it('should reject invalid password', async () => {
    const rawPassword = 'CorrectPassword123';
    const hash = await service.hashPassword(rawPassword);

    const isValid = await service.verifyPassword(hash, 'WrongPassword456');
    expect(isValid).toBe(false);
  });

  it('should return false for malformed hash', async () => {
    const isValid = await service.verifyPassword('invalid-hash-string', 'any-password');
    expect(isValid).toBe(false);
  });
});
