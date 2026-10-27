import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';

@Injectable()
export class WorkExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectFields = {
    id: true,
    userId: true,
    companyName: true,
    position: true,
    location: true,
    startYear: true,
    startMonth: true,
    endYear: true,
    endMonth: true,
    isCurrent: true,
    description: true,
    responsibilities: true,
    achievements: true,
    sortOrder: true,
    createdAt: true,
    updatedAt: true,
    technologies: {
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

  async findAll(userId: string) {
    return this.prisma.workExperience.findMany({
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
    const experience = await this.prisma.workExperience.findFirst({
      where: { id, userId },
      select: this.selectFields,
    });

    if (!experience) {
      throw new NotFoundException('Work experience not found');
    }

    return experience;
  }

  async create(userId: string, dto: CreateWorkExperienceDto) {
    if (
      typeof dto.companyName !== 'string' ||
      !dto.companyName.trim() ||
      typeof dto.position !== 'string' ||
      !dto.position.trim()
    ) {
      throw new BadRequestException(
        'Company name and position cannot be empty',
      );
    }
    if (
      dto.sortOrder !== undefined &&
      (!Number.isInteger(dto.sortOrder) || dto.sortOrder < 0)
    ) {
      throw new BadRequestException('Sort order must be a non-negative integer');
    }

    this.validateDates(dto);

    try {
      return await this.prisma.workExperience.create({
        data: {
          companyName: dto.companyName.trim(),
          position: dto.position.trim(),
          location: dto.location?.trim() || null,
          startYear: dto.startYear,
          startMonth: dto.startMonth ?? null,
          endYear: dto.isCurrent ? null : (dto.endYear ?? null),
          endMonth: dto.isCurrent ? null : (dto.endMonth ?? null),
          isCurrent: dto.isCurrent,
          description: dto.description ?? null,
          responsibilities: dto.responsibilities ?? null,
          achievements: dto.achievements ?? null,
          sortOrder: dto.sortOrder ?? 0,
          user: {
            connect: { id: userId },
          },
          technologies: {
            create: (dto.technologyIds ?? []).map((technologyId) => ({
              technology: {
                connect: { id: technologyId },
              },
            })),
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
    dto: UpdateWorkExperienceDto,
  ) {
    const existing = await this.findOne(userId, id);
    if (
      (dto.companyName !== undefined &&
        (typeof dto.companyName !== 'string' || !dto.companyName.trim())) ||
      (dto.position !== undefined &&
        (typeof dto.position !== 'string' || !dto.position.trim()))
    ) {
      throw new BadRequestException(
        'Company name and position cannot be empty',
      );
    }
    if (
      dto.sortOrder !== undefined &&
      (!Number.isInteger(dto.sortOrder) || dto.sortOrder < 0)
    ) {
      throw new BadRequestException('Sort order must be a non-negative integer');
    }
    if (
      dto.startYear !== undefined &&
      (!Number.isInteger(dto.startYear) ||
        dto.startYear < 1900 ||
        dto.startYear > 9999)
    ) {
      throw new BadRequestException('A valid start year is required');
    }
    if (
      dto.isCurrent !== undefined &&
      typeof dto.isCurrent !== 'boolean'
    ) {
      throw new BadRequestException('isCurrent must be a boolean');
    }
    if (
      dto.technologyIds !== undefined &&
      !Array.isArray(dto.technologyIds)
    ) {
      throw new BadRequestException('technologyIds must be an array');
    }
    if (
      dto.isCurrent === true &&
      (dto.endYear != null || dto.endMonth != null)
    ) {
      throw new BadRequestException(
        'An ongoing work experience cannot have an end date',
      );
    }

    this.validateDates({
      startYear: dto.startYear ?? existing.startYear,
      startMonth: dto.startMonth === undefined
        ? existing.startMonth
        : dto.startMonth,
      endYear: dto.isCurrent === true
        ? null
        : dto.endYear === undefined
          ? existing.endYear
          : dto.endYear,
      endMonth: dto.isCurrent === true
        ? null
        : dto.endMonth === undefined
          ? existing.endMonth
          : dto.endMonth,
      isCurrent: dto.isCurrent ?? existing.isCurrent,
    });
    try {
      return await this.prisma.workExperience.update({
        where: { id },
        data: {
          ...(dto.companyName !== undefined && {
            companyName: dto.companyName.trim(),
          }),
          ...(dto.position !== undefined && {
            position: dto.position.trim(),
          }),
          ...(dto.location !== undefined && {
            location: dto.location?.trim() || null,
          }),
          ...(dto.startYear !== undefined && { startYear: dto.startYear }),
          ...(dto.startMonth !== undefined && {
            startMonth: dto.startMonth,
          }),
          ...(dto.endYear !== undefined && { endYear: dto.endYear }),
          ...(dto.endMonth !== undefined && { endMonth: dto.endMonth }),
          ...(dto.isCurrent !== undefined && {
            isCurrent: dto.isCurrent,
            ...(dto.isCurrent && { endYear: null, endMonth: null }),
          }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.responsibilities !== undefined && {
            responsibilities: dto.responsibilities,
          }),
          ...(dto.achievements !== undefined && {
            achievements: dto.achievements,
          }),
          ...(dto.sortOrder !== undefined && {
            sortOrder: dto.sortOrder,
          }),
          ...(dto.technologyIds !== undefined && {
            technologies: {
              deleteMany: {},
              create: dto.technologyIds.map((technologyId) => ({
                technology: {
                  connect: { id: technologyId },
                },
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

    return this.prisma.workExperience.delete({
      where: { id },
      select: this.selectFields,
    });
  }

  private validateDates(dates: {
    startYear: number;
    startMonth?: number | null;
    endYear?: number | null;
    endMonth?: number | null;
    isCurrent: boolean;
  }) {
    if (typeof dates.isCurrent !== 'boolean') {
      throw new BadRequestException('isCurrent must be a boolean');
    }

    if (
      !Number.isInteger(dates.startYear) ||
      dates.startYear < 1900 ||
      dates.startYear > 9999
    ) {
      throw new BadRequestException('A valid start year is required');
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

    if (
      dates.endYear != null &&
      (!Number.isInteger(dates.endYear) ||
        dates.endYear < 1900 ||
        dates.endYear > 9999)
    ) {
      throw new BadRequestException('A valid end year is required');
    }

    if (dates.isCurrent && (dates.endYear != null || dates.endMonth != null)) {
      throw new BadRequestException(
        'An ongoing work experience cannot have an end date',
      );
    }

    if (dates.endYear == null) {
      if (dates.endMonth != null) {
        throw new BadRequestException(
          'An end month requires an end year',
        );
      }
      return;
    }

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
        throw new NotFoundException('Work experience or technology not found');
      }
    }

    throw error;
  }
}
