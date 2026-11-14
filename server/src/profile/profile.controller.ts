import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  get() {
    return this.profileService.get();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() dto: UpdateProfileDto) {
    return this.profileService.update(dto);
  }
}
