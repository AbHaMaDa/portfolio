import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service.js';
import { PortfolioController } from './portfolio.controller.js';
import { ProfileModule } from '../profile/profile.module.js';
import { SkillsModule } from '../skills/skills.module.js';
import { ProjectsModule } from '../projects/projects.module.js';

@Module({
  imports: [ProfileModule, SkillsModule, ProjectsModule],
  providers: [PortfolioService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
