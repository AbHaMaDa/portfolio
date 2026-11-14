import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SkillDocument = HydratedDocument<Skill>;

@Schema({ timestamps: true, collection: 'skills' })
export class Skill {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ min: 1, max: 100, default: 50 })
  proficiency: number;

  @Prop({ default: '' })
  iconUrl: string;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
