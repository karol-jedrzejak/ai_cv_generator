import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectFields = {
    id: true,
    userId: true,
    institutionName: true,
    fieldOfStudy: true,
    startYear: true,
    startMonth: true,
    endYear: true,
    endMonth: true,
    description: true,
    achievements: true,
    sortOrder: true,
    createdAt: true,
    updatedAt: true,
    educationalTechnologies: {
      select: {
        technology: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    },
  };

  findAll(userId: string) {
    return this.prisma.education.findMany({
      where: { userId },
      select: this.selectFields,
      orderBy: [
        { sortOrder: 'asc' },
        { startYear: 'desc' },
        { startMonth: 'desc' },
      ],
    });
  }

  async findOne(userId: string, id: string) {
    const education = await this.prisma.education.findFirst({
      where: { id, userId },
      select: this.selectFields,
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    return education;
  }

  async create(userId: string, dto: CreateEducationDto) {
    this.validateTechnologyIds(dto.technologyIds);
    this.validate(dto);

    try {
      return await this.prisma.education.create({
        data: {
          institutionName: dto.institutionName.trim(),
          fieldOfStudy: dto.fieldOfStudy?.trim() || null,
          startYear: dto.startYear ?? null,
          startMonth: dto.startMonth ?? null,
          endYear: dto.endYear ?? null,
          endMonth: dto.endMonth ?? null,
          description: dto.description ?? null,
          achievements: dto.achievements ?? null,
          sortOrder: dto.sortOrder ?? 0,
          user: { connect: { id: userId } },
          educationalTechnologies: {
            create: (dto.technologyIds ?? []).map((technologyId) => ({
              technology: { connect: { id: technologyId } },
            })),
          },
        },
        select: this.selectFields,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(userId: string, id: string, dto: UpdateEducationDto) {
    const existing = await this.findOne(userId, id);
    if (
      dto.institutionName !== undefined &&
      (typeof dto.institutionName !== 'string' ||
        !dto.institutionName.trim())
    ) {
      throw new BadRequestException('Institution name cannot be empty');
    }
    this.validateTechnologyIds(dto.technologyIds);
    const dates = {
      startYear: dto.startYear === undefined ? existing.startYear : dto.startYear,
      startMonth: dto.startMonth === undefined
        ? existing.startMonth
        : dto.startMonth,
      endYear: dto.endYear === undefined ? existing.endYear : dto.endYear,
      endMonth: dto.endMonth === undefined
        ? existing.endMonth
        : dto.endMonth,
    };
    this.validate({
      ...dto,
      ...dates,
      institutionName: dto.institutionName ?? existing.institutionName,
    });

    try {
      return await this.prisma.education.update({
        where: { id },
        data: {
          ...(dto.institutionName !== undefined && {
            institutionName: dto.institutionName.trim(),
          }),
          ...(dto.fieldOfStudy !== undefined && {
            fieldOfStudy: dto.fieldOfStudy?.trim() || null,
          }),
          ...(dto.startYear !== undefined && { startYear: dto.startYear }),
          ...(dto.startMonth !== undefined && { startMonth: dto.startMonth }),
          ...(dto.endYear !== undefined && { endYear: dto.endYear }),
          ...(dto.endMonth !== undefined && { endMonth: dto.endMonth }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.achievements !== undefined && {
            achievements: dto.achievements,
          }),
          ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
          ...(dto.technologyIds !== undefined && {
            educationalTechnologies: {
              deleteMany: {},
              create: dto.technologyIds.map((technologyId) => ({
                technology: { connect: { id: technologyId } },
              })),
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
    return this.prisma.education.delete({
      where: { id },
      select: this.selectFields,
    });
  }

  private validate(dto: {
    institutionName: string;
    startYear?: number | null;
    startMonth?: number | null;
    endYear?: number | null;
    endMonth?: number | null;
    sortOrder?: number;
  }) {
    if (
      typeof dto.institutionName !== 'string' ||
      !dto.institutionName.trim()
    ) {
      throw new BadRequestException('Institution name cannot be empty');
    }
    if (
      dto.sortOrder !== undefined &&
      (!Number.isInteger(dto.sortOrder) || dto.sortOrder < 0)
    ) {
      throw new BadRequestException('Sort order must be a non-negative integer');
    }
    this.validateDates(dto);
  }

  private validateTechnologyIds(technologyIds?: string[]) {
    if (technologyIds !== undefined && !Array.isArray(technologyIds)) {
      throw new BadRequestException('technologyIds must be an array');
    }
  }

  private validateDates(dates: {
    startYear?: number | null;
    startMonth?: number | null;
    endYear?: number | null;
    endMonth?: number | null;
  }) {
    for (const [label, year] of [
      ['start', dates.startYear],
      ['end', dates.endYear],
    ] as const) {
      if (
        year != null &&
        (!Number.isInteger(year) || year < 1900 || year > 9999)
      ) {
        throw new BadRequestException(`A valid ${label} year is required`);
      }
    }
    for (const [label, month] of [
      ['start', dates.startMonth],
      ['end', dates.endMonth],
    ] as const) {
      if (
        month != null &&
        (!Number.isInteger(month) || month < 1 || month > 12)
      ) {
        throw new BadRequestException(
          `The ${label} month must be between 1 and 12`,
        );
      }
    }
    if (dates.startYear == null && dates.startMonth != null) {
      throw new BadRequestException('A start month requires a start year');
    }
    if (dates.endYear == null && dates.endMonth != null) {
      throw new BadRequestException('An end month requires an end year');
    }
    if (dates.startYear == null || dates.endYear == null) return;
    if (dates.endYear < dates.startYear) {
      throw new BadRequestException(
        'The end date cannot be earlier than the start date',
      );
    }
    if (
      dates.endYear === dates.startYear &&
      dates.startMonth != null &&
      dates.endMonth != null &&
      dates.endMonth < dates.startMonth
    ) {
      throw new BadRequestException(
        'The end date cannot be earlier than the start date',
      );
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025' || error.code === 'P2003') {
        throw new NotFoundException('Education or technology not found');
      }
    }
    throw error;
  }
}
