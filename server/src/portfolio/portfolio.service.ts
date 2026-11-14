import { Injectable } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service.js';
import { SkillsService } from '../skills/skills.service.js';
import { ProjectsService } from '../projects/projects.service.js';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly skillsService: SkillsService,
    private readonly projectsService: ProjectsService,
  ) {}

  async getAll() {
    const [profile, skills, projects] = await Promise.all([
      this.profileService.get().catch(() => null),
      this.skillsService.findAll(),
      this.projectsService.findAll(),
    ]);

    // Group skills by category
    const skillsGrouped = (skills as Array<{ category: string; toObject: () => object }>).reduce<
      Record<string, object[]>
    >((acc, skill) => {
      const cat = skill.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});

    return { profile, skills: skillsGrouped, projects };
  }
}
