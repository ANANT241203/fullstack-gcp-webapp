import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async getUsers() {
    // Always load users.json from the project root, works in dev and prod
    const usersPath = path.join(process.cwd(), 'src', 'auth', 'users.json');
    const usersRaw = fs.readFileSync(usersPath, 'utf-8');
    return JSON.parse(usersRaw);
  }

  async login(username: string, password: string): Promise<{ access_token?: string }> {
    const users = await this.getUsers();
    const user = users.find(
      (user: any) => user.username === username && user.password === password,
    );
    if (user) {
      const payload = { username: user.username };
      const access_token = this.jwtService.sign(payload);
      return { access_token };
    }
    return {};
  }
}
