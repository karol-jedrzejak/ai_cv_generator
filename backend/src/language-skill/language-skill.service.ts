import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLanguageSkillDto } from './dto/create-language-skill.dto';
import { UpdateLanguageSkillDto } from './dto/update-language-skill.dto';

@Injectable()
export class LanguageSkillService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectFields = {
    id: true,
    userId: true,
    languageId: true,
    level: true,
    sortOrder: true,
    createdAt: true,
    updatedAt: true,
    language: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  async findAll(userId: string) {
    return this.prisma.languageSkill.findMany({
      where: { userId },
      select: this.selectFields,
      orderBy: [
        { sortOrder: 'asc' },
        { language: { name: 'asc' } },
      ],
    });
  }

  async findOne(userId: string, id: string) {
    const languageSkill = await this.prisma.languageSkill.findFirst({
      where: { id, userId },
      select: this.selectFields,
    });

    if (!languageSkill) {
      throw new NotFoundException('Language skill not found');
    }

    return languageSkill;
  }

  async create(userId: string, dto: CreateLanguageSkillDto) {
    try {
      return await this.prisma.languageSkill.create({
        data: {
          level: dto.level,
          sortOrder: dto.sortOrder ?? 0,
          user: {
            connect: { id: userId },
          },
          language: {
            connect: { id: dto.languageId },
          },
        },
        select: this.selectFields,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateLanguageSkillDto,
  ) {
    await this.findOne(userId, id);

    try {
      return await this.prisma.languageSkill.update({
        where: { id },
        data: {
          ...(dto.level !== undefined && { level: dto.level }),
          ...(dto.sortOrder !== undefined && {
            sortOrder: dto.sortOrder,
          }),
          ...(dto.languageId !== undefined && {
            language: {
              connect: { id: dto.languageId },
            },
          }),
        },
        select: this.selectFields,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.languageSkill.delete({
      where: { id },
      select: this.selectFields,
    });
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'This language is already assigned to the user',
        );
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('User or language not found');
      }
    }

    throw error;
  }
}
