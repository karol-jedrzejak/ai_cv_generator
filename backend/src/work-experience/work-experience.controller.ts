import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';
import { WorkExperienceService } from './work-experience.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('work-experiences')
export class WorkExperienceController {
  constructor(
    private readonly workExperienceService: WorkExperienceService,
  ) {}

  @Get()
  getAll(@Req() req: AuthenticatedRequest) {
    return this.workExperienceService.findAll(req.user.id);
  }

  @Get(':id')
  getOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.workExperienceService.findOne(req.user.id, id);
  }

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateWorkExperienceDto,
  ) {
    return this.workExperienceService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkExperienceDto,
  ) {
    return this.workExperienceService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.workExperienceService.remove(req.user.id, id);
  }
}
