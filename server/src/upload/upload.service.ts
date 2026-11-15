import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

// Vercel serverless functions reject request bodies above ~4.5MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;

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
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File too large. Max size: 4MB');
    }

    // Generate unique safe filename
    const ext = path.extname(file.originalname) || (file.mimetype === 'image/png' ? '.png' : '.jpg');
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;

    // On Vercel the filesystem is ephemeral — store in Vercel Blob instead.
    // Set BLOB_READ_WRITE_TOKEN in the project env to enable this path.
    if (this.config.get<string>('BLOB_READ_WRITE_TOKEN')) {
      const blob = await put(`portfolio-uploads/${safeName}`, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
        addRandomSuffix: false,
      });
      return {
        url: blob.url,
        filename: safeName,
        originalname: file.originalname,
        size: file.size,
      };
    }

    // Local development: save to disk and serve via GET /api/upload/:filename
    const targetPath = path.join(this.uploadDir, safeName);
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
