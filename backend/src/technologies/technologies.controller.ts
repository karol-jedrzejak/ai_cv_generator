
import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { TechnologiesService } from './technologies.service';
import { FindTechnologiesDto } from './dto/find-technologies.dto';

@UseGuards(JwtAuthGuard)
@Controller('technologies')
export class TechnologiesController {
  constructor(
    private readonly technologiesService: TechnologiesService,
  ) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  findAll(@Query() query: FindTechnologiesDto) {
    return this.technologiesService.findAll(
      query.search,
      query.category,
    );
  }
}
