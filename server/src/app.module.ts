import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { SkillsModule } from './skills/skills.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { PortfolioModule } from './portfolio/portfolio.module.js';
import { UploadModule } from './upload/upload.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    ProfileModule,
    SkillsModule,
    ProjectsModule,
    PortfolioModule,
    UploadModule,
  ],
})
export class AppModule {}
