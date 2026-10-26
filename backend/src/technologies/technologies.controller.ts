
import { Controller, Get, Query } from '@nestjs/common';
import { TechnologiesService } from './technologies.service';
import { TechnologyCategory } from '../../generated/prisma/browser';

@Controller('technologies')
export class TechnologiesController {
  constructor(
    private readonly technologiesService: TechnologiesService,
  ) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: TechnologyCategory,
  ) {
    return this.technologiesService.findAll(search, category);
  }
}
