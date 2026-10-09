
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';

@Injectable()
export class SocialLinksService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectFields = {
    id: true,
    userId: true,
    type: true,
    label: true,
    sortOrder: true,
    url: true,
    createdAt: true,
    updatedAt: true,
  };

  async findAll(userId: string) {
    return this.prisma.userSocialLink.findMany({
      where: { userId },
      select: this.selectFields,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async findOne(userId: string, id: string) {
    const link = await this.prisma.userSocialLink.findFirst({
      where: { id, userId },
      select: this.selectFields,
    });

    if (!link) {
      throw new NotFoundException('Social link not found');
    }

    return link;
  }

  async create(userId: string, dto: CreateSocialLinkDto) {
    return this.prisma.userSocialLink.create({
      data: {
        type: dto.type,
        label: dto.label,
        url: dto.url,
        sortOrder: dto.sortOrder ?? 0,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateSocialLinkDto,
  ) {
    await this.findOne(userId, id);

    return this.prisma.userSocialLink.update({
      where: { id },
      data: dto,
      select: this.selectFields,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.userSocialLink.delete({
      where: { id },
      select: this.selectFields,
    });
  }
}