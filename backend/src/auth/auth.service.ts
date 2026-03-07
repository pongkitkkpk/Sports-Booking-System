// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// ตัวอย่าง user mock แบบชั่วคราว
const mockUsers = [
  { id: 1, username: 'student01', password: '1234', role: 'student' },
  { id: 2, username: 'staff01', password: 'abcd', role: 'staff' },
  { id: 2, username: 'admin', password: 'admin', role: 'admin' },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // ตรวจสอบชื่อผู้ใช้และรหัสผ่านจาก mock
  async validateUser(username: string, password: string): Promise<any> {
    const user = mockUsers.find((u) => u.username === username && u.password === password);
    if (!user) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    const { password: _, ...result } = user;
    return result;
  }

  // สร้าง token JWT
  async login(user: any) {
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
