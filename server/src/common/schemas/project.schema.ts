import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true, collection: 'projects' })
export class Project {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ default: '' })
  architectureNotes: string;

  @Prop({ default: '' })
  repoUrl: string;

  @Prop({ default: '' })
  liveUrl: string;

  @Prop({ default: '' })
  thumbnailUrl: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }], default: [] })
  skills: Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
