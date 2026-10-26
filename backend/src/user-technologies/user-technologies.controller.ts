
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
    sub: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('user-technologies')
export class UserTechnologiesController {
  constructor(
    private readonly UserTechnologiesService: UserTechnologiesService,
  ) {}

  @Get()
  async getAll(@Req() req: AuthenticatedRequest) {
    return this.UserTechnologiesService.findAll(req.user.sub);
  }

  @Get(':id')
  async getOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.UserTechnologiesService.findOne(req.user.sub, id);
  }

  @Post()
  create(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: CreateUserTechnologyDto,
  ) {
    return this.UserTechnologiesService.create(
      req.user.id,
      dto,
    );
  }

  @Patch(':id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserTechnologyDto,
  ) {
    return this.UserTechnologiesService.update(
      req.user.sub,
      id,
      dto,
    );
  }

  @Delete(':id')
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.UserTechnologiesService.remove(req.user.sub, id);
  }
}