import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUser, AdminUserDocument } from '../common/schemas/admin-user.schema.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AdminUser.name) private adminModel: Model<AdminUserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.adminModel.findOne({ email: dto.email });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: admin._id.toString(),
      email: admin.email,
    });

    return { access_token: token };
  }

  async getMe(userId: string) {
    const admin = await this.adminModel.findById(userId).select('-passwordHash');
    if (!admin) throw new UnauthorizedException();
    return admin;
  }
}
