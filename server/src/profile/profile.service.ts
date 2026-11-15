import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../common/schemas/profile.schema.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async get() {
    const profile = await this.profileModel.findOne();
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(dto: UpdateProfileDto) {
    const profile = await this.profileModel.findOneAndUpdate({}, dto, {
      returnDocument: 'after',
      upsert: true,
    });
    return profile;
  }
}
