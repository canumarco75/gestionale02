import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const demoUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'changeme',
    role: 'admin'
  }
];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = demoUsers.find((candidate) => candidate.email === email);

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Credenziali non valide');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: await this.jwtService.signAsync(payload)
    };
  }
}
