import { Controller, Post, Body, UseGuards, Get, UseInterceptors, UploadedFile, Res, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { GcsService } from './gcs.service';
import { Response } from 'express';
import * as fs from 'fs';
import { FileEventsGateway } from './file-events.gateway';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly gcsService: GcsService,
    private readonly fileEventsGateway: FileEventsGateway,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string, password: string }) {
    const result = await this.authService.login(body.username, body.password);
    if (result.access_token) {
      return { access_token: result.access_token };
    } else {
      return { message: 'Invalid credentials' };
    }
  }

  @Post('google-login')
  async googleLogin(@Body() body: { token: string }) {
    // Simulate Google OAuth: accept any token and return a JWT for a mock user
    const result = await this.authService.login('googleuser', '');
    if (result.access_token) {
      return { access_token: result.access_token, user: { username: 'googleuser', provider: 'google' } };
    } else {
      return { message: 'Google login failed' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Body() body: any) {
    return { message: 'You have accessed a protected route!' };
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { message: 'No file uploaded' };
    }
    // Upload to GCS
    const gcsFilename = await this.gcsService.uploadFile(file.path, file.filename);
    // Emit WebSocket event
    this.fileEventsGateway.emitFileUploaded({ filename: file.filename });
    return { message: 'File uploaded successfully', filename: file.filename, gcsFilename };
  }

  @UseGuards(JwtAuthGuard)
  @Get('files')
  listFiles() {
    // Simulate GCS by listing files in uploads/
    const files = fs.readdirSync('./uploads');
    return { files };
  }

  @UseGuards(JwtAuthGuard)
  @Get('files/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = `./uploads/${filename}`;
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  }

  // Cloud Function image processing stub
  @Post('process-image')
  async processImageStub(@Body() body: { filename: string }) {
    // In a real app, this would be triggered by a GCS event or HTTP call
    // Here, just simulate processing
    return { message: `Image ${body.filename} processed (stub)` };
  }
}
