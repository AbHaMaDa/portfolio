import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private uploadDir = path.resolve(process.cwd(), 'uploads');

  constructor(private config: ConfigService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed: JPEG, PNG, WebP, SVG, PDF');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File too large. Max size: 10MB');
    }

    // Generate unique safe filename
    const ext = path.extname(file.originalname) || (file.mimetype === 'image/png' ? '.png' : '.jpg');
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const targetPath = path.join(this.uploadDir, safeName);

    // Save to disk
    fs.writeFileSync(targetPath, file.buffer);

    return {
      url: `/api/upload/${safeName}`,
      filename: safeName,
      originalname: file.originalname,
      size: file.size,
    };
  }

  getFilePath(filename: string): string {
    const filePath = path.join(this.uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }
    return filePath;
  }
}
