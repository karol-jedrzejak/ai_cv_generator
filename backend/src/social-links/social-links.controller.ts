
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
import { SocialLinksService } from './social-links.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('social-links')
export class SocialLinksController {
  constructor(
    private readonly socialLinksService: SocialLinksService,
  ) {}

  @Get()
  async getAll(@Req() req: AuthenticatedRequest) {
    return this.socialLinksService.findAll(req.user.sub);
  }

  @Get(':id')
  async getOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.socialLinksService.findOne(req.user.sub, id);
  }

  @Post()
  create(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: CreateSocialLinkDto,
  ) {
    return this.socialLinksService.create(
      req.user.id,
      dto,
    );
  }

  @Patch(':id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSocialLinkDto,
  ) {
    return this.socialLinksService.update(
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
    return this.socialLinksService.remove(req.user.sub, id);
  }
}