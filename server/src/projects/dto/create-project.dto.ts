import { IsString, IsBoolean, IsNumber, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  summary: string;

  @IsOptional()
  @IsString()
  architectureNotes?: string;

  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillIds?: string[];
}
