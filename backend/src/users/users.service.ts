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
    hometown: true,
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
