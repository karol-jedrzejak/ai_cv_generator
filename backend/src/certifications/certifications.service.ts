import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';

@Injectable()
export class CertificationsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectFields = {
    id: true,
    userId: true,
    name: true,
    organization: true,
    issuedYear: true,
    issuedMonth: true,
    expirationYear: true,
    expirationMonth: true,
    credentialId: true,
    credentialUrl: true,
    description: true,
    createdAt: true,
    updatedAt: true,
    certificationTechnologies: {
      select: {
        technology: {
          select: { id: true, name: true, category: true },
        },
      },
    },
  };

  findAll(userId: string) {
    return this.prisma.certification.findMany({
      where: { userId },
      select: this.selectFields,
      orderBy: [
        { issuedYear: 'desc' },
        { issuedMonth: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(userId: string, id: string) {
    const certification = await this.prisma.certification.findFirst({
      where: { id, userId },
      select: this.selectFields,
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    return certification;
  }

  async create(userId: string, dto: CreateCertificationDto) {
    this.validateTechnologyIds(dto.technologyIds);
    this.validate(dto);

    try {
      return await this.prisma.certification.create({
        data: {
          name: dto.name.trim(),
          organization: dto.organization.trim(),
          issuedYear: dto.issuedYear ?? null,
          issuedMonth: dto.issuedMonth ?? null,
          expirationYear: dto.expirationYear ?? null,
          expirationMonth: dto.expirationMonth ?? null,
          credentialId: dto.credentialId?.trim() || null,
          credentialUrl: dto.credentialUrl?.trim() || null,
          description: dto.description ?? null,
          user: { connect: { id: userId } },
          certificationTechnologies: {
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

  async update(
    userId: string,
    id: string,
    dto: UpdateCertificationDto,
  ) {
    const existing = await this.findOne(userId, id);
    if (
      (dto.name !== undefined &&
        (typeof dto.name !== 'string' || !dto.name.trim())) ||
      (dto.organization !== undefined &&
        (typeof dto.organization !== 'string' || !dto.organization.trim()))
    ) {
      throw new BadRequestException(
        'Certification name and organization cannot be empty',
      );
    }
    this.validateTechnologyIds(dto.technologyIds);
    this.validate({
      ...dto,
      name: dto.name ?? existing.name,
      organization: dto.organization ?? existing.organization,
      issuedYear: dto.issuedYear === undefined
        ? existing.issuedYear
        : dto.issuedYear,
      issuedMonth: dto.issuedMonth === undefined
        ? existing.issuedMonth
        : dto.issuedMonth,
      expirationYear: dto.expirationYear === undefined
        ? existing.expirationYear
        : dto.expirationYear,
      expirationMonth: dto.expirationMonth === undefined
        ? existing.expirationMonth
        : dto.expirationMonth,
    });

    try {
      return await this.prisma.certification.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name.trim() }),
          ...(dto.organization !== undefined && {
            organization: dto.organization.trim(),
          }),
          ...(dto.issuedYear !== undefined && { issuedYear: dto.issuedYear }),
          ...(dto.issuedMonth !== undefined && { issuedMonth: dto.issuedMonth }),
          ...(dto.expirationYear !== undefined && {
            expirationYear: dto.expirationYear,
          }),
          ...(dto.expirationMonth !== undefined && {
            expirationMonth: dto.expirationMonth,
          }),
          ...(dto.credentialId !== undefined && {
            credentialId: dto.credentialId?.trim() || null,
          }),
          ...(dto.credentialUrl !== undefined && {
            credentialUrl: dto.credentialUrl?.trim() || null,
          }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.technologyIds !== undefined && {
            certificationTechnologies: {
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
    return this.prisma.certification.delete({
      where: { id },
      select: this.selectFields,
    });
  }

  private validateTechnologyIds(technologyIds?: string[]) {
    if (technologyIds !== undefined && !Array.isArray(technologyIds)) {
      throw new BadRequestException('technologyIds must be an array');
    }
  }

  private validate(dto: {
    name: string;
    organization: string;
    issuedYear?: number | null;
    issuedMonth?: number | null;
    expirationYear?: number | null;
    expirationMonth?: number | null;
  }) {
    if (
      typeof dto.name !== 'string' ||
      !dto.name.trim() ||
      typeof dto.organization !== 'string' ||
      !dto.organization.trim()
    ) {
      throw new BadRequestException(
        'Certification name and organization cannot be empty',
      );
    }

    for (const [label, year] of [
      ['issued', dto.issuedYear],
      ['expiration', dto.expirationYear],
    ] as const) {
      if (
        year != null &&
        (!Number.isInteger(year) || year < 1900 || year > 9999)
      ) {
        throw new BadRequestException(`A valid ${label} year is required`);
      }
    }
    for (const [label, month] of [
      ['issued', dto.issuedMonth],
      ['expiration', dto.expirationMonth],
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
    if (dto.issuedYear == null && dto.issuedMonth != null) {
      throw new BadRequestException('An issue month requires an issue year');
    }
    if (dto.expirationYear == null && dto.expirationMonth != null) {
      throw new BadRequestException(
        'An expiration month requires an expiration year',
      );
    }
    if (dto.issuedYear == null || dto.expirationYear == null) return;
    if (
      dto.expirationYear < dto.issuedYear ||
      (dto.expirationYear === dto.issuedYear &&
        dto.issuedMonth != null &&
        dto.expirationMonth != null &&
        dto.expirationMonth < dto.issuedMonth)
    ) {
      throw new BadRequestException(
        'The expiration date cannot be earlier than the issue date',
      );
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025' || error.code === 'P2003') {
        throw new NotFoundException('Certification or technology not found');
      }
    }
    throw error;
  }
}
