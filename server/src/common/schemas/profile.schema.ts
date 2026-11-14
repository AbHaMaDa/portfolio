import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true, collection: 'profiles' })
export class Profile {
  @Prop({ required: true })
  fullName: string;

  @Prop({ default: '' })
  headline: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  location: string;

  @Prop({ default: '' })
  githubUrl: string;

  @Prop({ default: '' })
  linkedinUrl: string;

  @Prop({ default: '' })
  resumeUrl: string;

  @Prop({ default: '/your-photo.png' })
  avatarUrl: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
