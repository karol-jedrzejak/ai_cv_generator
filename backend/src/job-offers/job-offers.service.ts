import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';

@Injectable()
export class JobOffersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly generatedDocumentListSelect = {
    id: true,
    jobOfferId: true,
    languageId: true,
    description: true,
    createdAt: true,
    language: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  private readonly generatedDocumentDetailSelect = {
    ...this.generatedDocumentListSelect,
    content: true,
  };

  private readonly selectFields = {
    id: true,
    userId: true,
    title: true,
    companyName: true,
    url: true,
    description: true,
    createdAt: true,
    updatedAt: true,
  };

  findAll(userId: string) {
    return this.prisma.jobOffer.findMany({
      where: { userId },
      select: this.selectFields,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const jobOffer = await this.prisma.jobOffer.findFirst({
      where: { id, userId },
      select: this.selectFields,
    });

    if (!jobOffer) {
      throw new NotFoundException('Job offer not found');
    }

    return jobOffer;
  }

  async create(userId: string, dto: CreateJobOfferDto) {
    this.validateRequiredFields(dto);

    return this.prisma.jobOffer.create({
      data: {
        title: dto.title.trim(),
        companyName: dto.companyName?.trim() || null,
        url: dto.url?.trim() || null,
        description: dto.description.trim(),
        user: { connect: { id: userId } },
      },
      select: this.selectFields,
    });
  }

  async update(userId: string, id: string, dto: UpdateJobOfferDto) {
    await this.findOne(userId, id);
    this.validateRequiredFields(dto);

    try {
      return await this.prisma.jobOffer.update({
        where: { id },
        data: {
          ...(dto.title !== undefined && { title: dto.title.trim() }),
          ...(dto.companyName !== undefined && {
            companyName: dto.companyName?.trim() || null,
          }),
          ...(dto.url !== undefined && { url: dto.url?.trim() || null }),
          ...(dto.description !== undefined && {
            description: dto.description.trim(),
          }),
        },
        select: this.selectFields,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Job offer not found');
      }
      throw error;
    }
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.jobOffer.delete({
      where: { id },
      select: this.selectFields,
    });
  }

  async findGeneratedCvs(userId: string, jobOfferId: string) {
    await this.findOne(userId, jobOfferId);
    return this.prisma.generatedCv.findMany({
      where: { userId, jobOfferId },
      select: this.generatedDocumentListSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findGeneratedCv(userId: string, jobOfferId: string, documentId: string) {
    const document = await this.prisma.generatedCv.findFirst({
      where: { id: documentId, jobOfferId, userId },
      select: this.generatedDocumentDetailSelect,
    });
    if (!document) {
      throw new NotFoundException('Generated CV not found');
    }
    return document;
  }

  async generateCv(userId: string, jobOfferId: string, languageId: string) {
    await this.findOne(userId, jobOfferId);
    await this.ensureDocumentLanguageAvailable(
      this.prisma.generatedCv.findFirst({
        where: { userId, jobOfferId, languageId },
        select: { id: true },
      }),
      'A CV already exists for this language and job offer',
    );

    try {
      return await this.prisma.generatedCv.create({
        data: {
          description: 'lorem ipsum',
          content: { text: 'lorem ipsum' },
          user: { connect: { id: userId } },
          jobOffer: { connect: { id: jobOfferId } },
          language: { connect: { id: languageId } },
        },
        select: this.generatedDocumentDetailSelect,
      });
    } catch (error) {
      this.handleGeneratedDocumentPrismaError(error);
    }
  }

  async removeGeneratedCv(
    userId: string,
    jobOfferId: string,
    documentId: string,
  ) {
    const result = await this.prisma.generatedCv.deleteMany({
      where: { id: documentId, jobOfferId, userId },
    });
    if (result.count === 0) {
      throw new NotFoundException('Generated CV not found');
    }
    return { id: documentId };
  }

  async findGeneratedMotivationLetters(userId: string, jobOfferId: string) {
    await this.findOne(userId, jobOfferId);
    return this.prisma.generatedMotivationLetters.findMany({
      where: { userId, jobOfferId },
      select: this.generatedDocumentListSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findGeneratedMotivationLetter(
    userId: string,
    jobOfferId: string,
    documentId: string,
  ) {
    const document = await this.prisma.generatedMotivationLetters.findFirst({
      where: { id: documentId, jobOfferId, userId },
      select: this.generatedDocumentDetailSelect,
    });
    if (!document) {
      throw new NotFoundException('Generated cover letter not found');
    }
    return document;
  }

  async generateMotivationLetter(
    userId: string,
    jobOfferId: string,
    languageId: string,
  ) {
    await this.findOne(userId, jobOfferId);
    await this.ensureDocumentLanguageAvailable(
      this.prisma.generatedMotivationLetters.findFirst({
        where: { userId, jobOfferId, languageId },
        select: { id: true },
      }),
      'A cover letter already exists for this language and job offer',
    );

    try {
      return await this.prisma.generatedMotivationLetters.create({
        data: {
          description: 'lorem ipsum',
          content: { text: 'lorem ipsum' },
          user: { connect: { id: userId } },
          jobOffer: { connect: { id: jobOfferId } },
          language: { connect: { id: languageId } },
        },
        select: this.generatedDocumentDetailSelect,
      });
    } catch (error) {
      this.handleGeneratedDocumentPrismaError(error);
    }
  }

  async removeGeneratedMotivationLetter(
    userId: string,
    jobOfferId: string,
    documentId: string,
  ) {
    const result = await this.prisma.generatedMotivationLetters.deleteMany({
      where: { id: documentId, jobOfferId, userId },
    });
    if (result.count === 0) {
      throw new NotFoundException('Generated cover letter not found');
    }
    return { id: documentId };
  }

  private async ensureDocumentLanguageAvailable(
    document: Promise<{ id: string } | null>,
    conflictMessage: string,
  ) {
    const existing = await document;
    if (existing) {
      throw new ConflictException(conflictMessage);
    }
  }

  private handleGeneratedDocumentPrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new NotFoundException('Language or job offer not found');
      }
    }
    throw error;
  }

  private validateRequiredFields(dto: {
    title?: string;
    description?: string;
  }) {
    if (
      dto.title !== undefined &&
      (typeof dto.title !== 'string' || !dto.title.trim())
    ) {
      throw new BadRequestException('Job offer title cannot be empty');
    }
    if (
      dto.description !== undefined &&
      (typeof dto.description !== 'string' || !dto.description.trim())
    ) {
      throw new BadRequestException('Job offer description cannot be empty');
    }
  }
}
