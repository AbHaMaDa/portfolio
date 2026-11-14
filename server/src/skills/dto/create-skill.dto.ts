import { IsString, IsNumber, IsOptional, IsUrl, Min, Max } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  proficiency?: number;

  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
