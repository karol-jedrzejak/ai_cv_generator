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
import { CreateLanguageSkillDto } from './dto/create-language-skill.dto';
import { UpdateLanguageSkillDto } from './dto/update-language-skill.dto';
import { LanguageSkillService } from './language-skill.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('language-skill')
export class LanguageSkillController {
  constructor(
    private readonly languageSkillService: LanguageSkillService,
  ) {}

  @Get()
  getAll(@Req() req: AuthenticatedRequest) {
    return this.languageSkillService.findAll(req.user.id);
  }

  @Get(':id')
  getOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.languageSkillService.findOne(req.user.id, id);
  }

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateLanguageSkillDto,
  ) {
    return this.languageSkillService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLanguageSkillDto,
  ) {
    return this.languageSkillService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.languageSkillService.remove(req.user.id, id);
  }
}
