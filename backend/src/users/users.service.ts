import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(private readonly prisma: PrismaService) {}

  private readonly profileSelect = {
    id: true,
    name: true,
    surname: true,
    email: true,
    mobilePhone: true,
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
    if (dto.password !== undefined || dto.confirmPassword !== undefined) {
      if (!dto.password || !dto.confirmPassword) {
        throw new BadRequestException('Enter and confirm the new password');
      }
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
    }

    const mobilePhone = dto.mobilePhone?.trim();
    if (mobilePhone) {
      const digits = mobilePhone.replace(/\D/g, '');
      if (
        !/^[+0-9().\s-]+$/.test(mobilePhone) ||
        digits.length < 7 ||
        digits.length > 15
      ) {
        throw new BadRequestException('Enter a valid mobile phone number');
      }
    }

    const email = dto.email?.trim().toLowerCase();
    if (email) {
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
    }

    const data = {
      ...(dto.name !== undefined && { name: dto.name?.trim() || null }),
      ...(dto.surname !== undefined && {
        surname: dto.surname?.trim() || null,
      }),
      ...(email !== undefined && { email }),
      ...(dto.mobilePhone !== undefined && {
        mobilePhone: mobilePhone || null,
      }),
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

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
        email: true,
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
