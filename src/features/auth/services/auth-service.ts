import { DBContext } from '../../../db-context';
import bcrypt from 'bcrypt';
import { AuthRepository } from '../repos/auth-repository';
import { Service } from '../../../util/service';

class AuthService extends Service<AuthRepository> {
  constructor(repo: AuthRepository) {
    super(repo);
  }

  async verifyPasswordByEmail(email: string, password: string, ctx: DBContext) {
    const encrypted = await this.repo.getEncryptedPasswordByEmail(email, ctx);
    return await bcrypt.compare(password, encrypted);
  }
}

export const authService = new AuthService(new AuthRepository());
