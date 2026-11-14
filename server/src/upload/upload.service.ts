import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Cloudinary upload — install `cloudinary` package when ready
// npm install cloudinary
@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {}

  async upload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed: JPEG, PNG, WebP, PDF');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File too large. Max size: 5MB');
    }

    // TODO: wire up Cloudinary or S3 here
    // const cloudinary = require('cloudinary').v2;
    // const result = await cloudinary.uploader.upload_stream(...)
    // return { url: result.secure_url };

    // Placeholder response until storage is configured
    return {
      url: `https://placeholder.com/${file.originalname}`,
      message: 'Configure Cloudinary/S3 in upload.service.ts to enable real uploads',
    };
  }
}
