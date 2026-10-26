
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
import { UserTechnologiesService } from './user-technologies.service';
import { CreateUserTechnologyDto } from './dto/create-user-technology.dto';
import { UpdateUserTechnologyDto } from './dto/update-user-technology.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('user-technologies')
export class UserTechnologiesController {
  constructor(
    private readonly userTechnologiesService: UserTechnologiesService,
  ) {}

  @Get()
  getAll(@Req() req: AuthenticatedRequest) {
    return this.userTechnologiesService.findAll(req.user.id);
  }

  @Get(':technologyId')
  getOne(
    @Req() req: AuthenticatedRequest,
    @Param('technologyId', ParseUUIDPipe) technologyId: string,
  ) {
    return this.userTechnologiesService.findOne(
      req.user.id,
      technologyId,
    );
  }

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateUserTechnologyDto,
  ) {
    return this.userTechnologiesService.create(
      req.user.id,
      dto,
    );
  }

  @Patch(':technologyId')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('technologyId', ParseUUIDPipe) technologyId: string,
    @Body() dto: UpdateUserTechnologyDto,
  ) {
    return this.userTechnologiesService.update(
      req.user.id,
      technologyId,
      dto,
    );
  }

  @Delete(':technologyId')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('technologyId', ParseUUIDPipe) technologyId: string,
  ) {
    return this.userTechnologiesService.remove(
      req.user.id,
      technologyId,
    );
  }
}
