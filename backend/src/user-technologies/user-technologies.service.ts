
import {
  Injectable,
  NotFoundException,
    ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

import { CreateUserTechnologyDto } from './dto/create-user-technology.dto';
import { UpdateUserTechnologyDto } from './dto/update-user-technology.dto';

@Injectable()
export class UserTechnologiesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectFields = {
    userId: true,
    technologyId: true,
    proficiency: true,
    technology: {
      select: {
        id: true,
        name: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  };

  async findAll(userId: string) {
    return this.prisma.userTechnology.findMany({
      where: { userId },
      select: this.selectFields,
      orderBy: [
        { technology: { name: 'asc' } },
        { proficiency: 'asc' },
      ],
    });
  }

  async findOne(userId: string, technologyId: string) {
    const userTechnology =
      await this.prisma.userTechnology.findUnique({
        where: {
          userId_technologyId: {
            userId,
            technologyId,
          },
        },
        select: this.selectFields,
      });

    if (!userTechnology) {
      throw new NotFoundException('UserTechnology not found');
    }

    return userTechnology;
  }

  async create(userId: string, dto: CreateUserTechnologyDto) {
    try {
      return await this.prisma.userTechnology.create({
        data: {
          proficiency: dto.proficiency ?? 1,
          user: {
            connect: { id: userId },
          },
          technology: {
            connect: { id: dto.technologyId },
          },
        },
        select: this.selectFields,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'This technology is already assigned to the user',
          );
        }

        if (error.code === 'P2025') {
          throw new NotFoundException(
            'User or technology not found',
          );
        }
      }

      throw error;
    }
  }

  async update(
    userId: string,
    technologyId: string,
    dto: UpdateUserTechnologyDto,
  ) {
    await this.findOne(userId, technologyId);

    return this.prisma.userTechnology.update({
      where: {
        userId_technologyId: {
          userId,
          technologyId,
        },
      },
      data: {
        ...(dto.proficiency !== undefined && {
          proficiency: dto.proficiency,
        }),
      },
      select: this.selectFields,
    });
  }

  async remove(userId: string, technologyId: string) {
    await this.findOne(userId, technologyId);

    return this.prisma.userTechnology.delete({
      where: {
        userId_technologyId: {
          userId,
          technologyId,
        },
      },
      select: this.selectFields,
    });
  }
}
