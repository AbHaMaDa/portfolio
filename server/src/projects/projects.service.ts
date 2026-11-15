import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../common/schemas/project.schema.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  findAll() {
    return this.projectModel
      .find()
      .sort({ featured: -1, sortOrder: 1 })
      .populate('skills');
  }

  async findBySlug(slug: string) {
    const project = await this.projectModel.findOne({ slug }).populate('skills');
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(dto: CreateProjectDto) {
    const { skillIds, ...rest } = dto;
    // Store ObjectId strings directly — Mongoose coerces them on save
    const doc = { ...rest, skills: skillIds ?? [] };
    return this.projectModel.create(doc as Parameters<typeof this.projectModel.create>[0]);
  }

  async update(id: string, dto: UpdateProjectDto) {
    const { skillIds, ...rest } = dto;
    const update: Record<string, unknown> = { ...rest };
    if (skillIds !== undefined) update.skills = skillIds;

    const project = await this.projectModel
      .findByIdAndUpdate(id, update, { returnDocument: 'after' })
      .populate('skills');
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async remove(id: string) {
    const project = await this.projectModel.findByIdAndDelete(id);
    if (!project) throw new NotFoundException('Project not found');
    return { deleted: true };
  }
}
