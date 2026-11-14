import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skill, SkillDocument } from '../common/schemas/skill.schema.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
  ) {}

  findAll() {
    return this.skillModel.find().sort({ sortOrder: 1, name: 1 });
  }

  create(dto: CreateSkillDto) {
    return this.skillModel.create(dto);
  }

  async update(id: string, dto: UpdateSkillDto) {
    const skill = await this.skillModel.findByIdAndUpdate(id, dto, { new: true });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async remove(id: string) {
    const skill = await this.skillModel.findByIdAndDelete(id);
    if (!skill) throw new NotFoundException('Skill not found');
    return { deleted: true };
  }
}
