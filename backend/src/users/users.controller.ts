import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Patch,
  Request,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const AVATAR_DIRECTORY = resolve(__dirname, '../../uploads/avatars');
const AVATAR_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. PUBLICZNY ENDPOINT – Działa zawsze dla każdego
  @Get('public')
  test() {
    return { message: 'Ten endpoint jest publiczny i działa zawsze.' };
  }

  // 2. PRYWATNY ENDPOINT – Działa tylko po zalogowaniu (z poprawnym tokenem JWT)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Request() req: { user: { id: string } }) {
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMyProfile(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          void mkdir(AVATAR_DIRECTORY, { recursive: true })
            .then(() => callback(null, AVATAR_DIRECTORY))
            .catch((error: Error) => callback(error, AVATAR_DIRECTORY));
        },
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${AVATAR_EXTENSIONS[file.mimetype]}`);
        },
      }),
      limits: { fileSize: MAX_AVATAR_SIZE, files: 1 },
      fileFilter: (_req, file, callback) => {
        if (!AVATAR_EXTENSIONS[file.mimetype]) {
          callback(
            new BadRequestException('Photo must be a JPEG, PNG, or WebP image'),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  uploadMyPhoto(
    @Request() req: { user: { id: string } },
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    return this.usersService.updatePhoto(req.user.id, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProfile(@Request() req: { user: { id: string; email: string } }) {
    return req.user; // Zwraca zalogowanego użytkownika (zdekodowanego w JwtStrategy)
  }

  @Get('all')
  async findAll() {
    return this.usersService.findAll();
  }
}
