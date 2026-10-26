

import {
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TechnologyCategory } from '../../generated/prisma/browser';

@Injectable()
export class TechnologiesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(search?: string, category?: TechnologyCategory) {
        const normalizedSearch = search?.trim();

        return this.prisma.technology.findMany({
            where: {
                ...(normalizedSearch && {
                    name: {
                        contains: normalizedSearch,
                        mode: 'insensitive',
                    },
                }),
                ...(category && { category }),
            },
            select: {
                id: true,
                name: true,
                category: true,
            },
            orderBy: [
                { category: 'asc' },
                { name: 'asc' },
            ],
            take: 50,
        });
    }
}
