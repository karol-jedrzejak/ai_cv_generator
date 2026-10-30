import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { readFile, unlink } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  private readonly profileSelect = {
    id: true,
    name: true,
    surname: true,
    email: true,
    mobilePhone: true,
    hometown: true,
    avatarUrl: true,
    updatedAt: true,
  };

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.profileSelect,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const name = dto.name.trim();
    const surname = dto.surname.trim();
    const hometown = dto.hometown.trim();
    const mobilePhone = dto.mobilePhone.trim();
    if (!name || !surname || !hometown || !mobilePhone) {
      throw new BadRequestException(
        'Name, surname, mobile phone, and hometown are required',
      );
    }

    if (dto.password !== undefined || dto.confirmPassword !== undefined) {
      if (!dto.password || !dto.confirmPassword) {
        throw new BadRequestException('Enter and confirm the new password');
      }
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
    }

    const phoneDigits = mobilePhone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      throw new BadRequestException('Enter a valid mobile phone number');
    }

    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        NOT: { id: userId },
      },
      select: { id: true },
    });
    if (existingUser) {
      throw new ConflictException('Email address is already in use');
    }

    const data = {
      name,
      surname,
      email,
      mobilePhone,
      hometown,
      ...(dto.password !== undefined && {
        passwordHash: await bcrypt.hash(dto.password, this.saltRounds),
      }),
    };

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data,
        select: this.profileSelect,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email address is already in use');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
      throw error;
    }
  }

  async updatePhoto(userId: string, file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('Select a photo to upload');
    }

    let previousAvatarUrl: string | null;
    try {
      const contents = await readFile(file.path);
      if (!this.matchesImageSignature(contents, file.mimetype)) {
        throw new BadRequestException(
          'The uploaded file is not a valid JPEG, PNG, or WebP image',
        );
      }

      const previous = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatarUrl: true },
      });
      if (!previous) {
        throw new NotFoundException('User not found');
      }
      previousAvatarUrl = previous.avatarUrl;
    } catch (error) {
      await this.removeUploadedFile(file.path);
      throw error;
    }

    const avatarUrl = `/uploads/avatars/${basename(file.filename)}`;
    const profile = await this.prisma.user
      .update({
        where: { id: userId },
        data: { avatarUrl },
        select: this.profileSelect,
      })
      .catch(async (error: unknown) => {
        await this.removeUploadedFile(file.path);
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException('User not found');
        }
        throw error;
      });

    try {
      await this.removeStoredPhoto(previousAvatarUrl);
    } catch (error) {
      this.logger.warn(
        `Could not remove the previous profile photo for user ${userId}: ${
          error instanceof Error ? error.message : 'Unknown filesystem error'
        }`,
      );
    }
    return profile;
  }

  private matchesImageSignature(contents: Buffer, mimeType: string): boolean {
    if (mimeType === 'image/jpeg') {
      return (
        contents.length >= 3 &&
        contents[0] === 0xff &&
        contents[1] === 0xd8 &&
        contents[2] === 0xff
      );
    }
    if (mimeType === 'image/png') {
      return (
        contents.length >= 8 &&
        contents
          .subarray(0, 8)
          .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      );
    }
    if (mimeType === 'image/webp') {
      return (
        contents.length >= 12 &&
        contents.toString('ascii', 0, 4) === 'RIFF' &&
        contents.toString('ascii', 8, 12) === 'WEBP'
      );
    }
    return false;
  }

  private async removeStoredPhoto(avatarUrl: string | null) {
    if (!avatarUrl?.startsWith('/uploads/avatars/')) {
      return;
    }
    const filename = basename(avatarUrl);
    await this.removeUploadedFile(
      resolve(__dirname, '../../uploads/avatars', filename),
    );
  }

  private async removeUploadedFile(path: string) {
    try {
      await unlink(path);
    } catch (error) {
      if (!(
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      )) {
        throw error;
      }
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
        email: true,
        mobilePhone: true,
        hometown: true,
        avatarUrl: true,
        isActive: true,
        emailVerifiedAt: true,
        themePreference: true,
        locale: true,
        timezone: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }
}
