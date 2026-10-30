import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GenerateJobOfferDocumentDto } from './dto/generate-job-offer-document.dto';
import { GeneratedCvsService } from './generated-cvs.service';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@UseGuards(JwtAuthGuard)
@Controller('job-offers/:jobOfferId/generated-cvs')
export class GeneratedCvsController {
  constructor(private readonly generatedCvsService: GeneratedCvsService) {}

  @Get()
  getAll(
    @Req() req: AuthenticatedRequest,
    @Param('jobOfferId', ParseUUIDPipe) jobOfferId: string,
  ) {
    return this.generatedCvsService.findGeneratedCvs(req.user.id, jobOfferId);
  }

  @Post('generate')
  generate(
    @Req() req: AuthenticatedRequest,
    @Param('jobOfferId', ParseUUIDPipe) jobOfferId: string,
    @Body() dto: GenerateJobOfferDocumentDto,
  ) {
    return this.generatedCvsService.generateCv(
      req.user.id,
      jobOfferId,
      dto.languageId,
    );
  }

  @Get(':documentId')
  getOne(
    @Req() req: AuthenticatedRequest,
    @Param('jobOfferId', ParseUUIDPipe) jobOfferId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    return this.generatedCvsService.findGeneratedCv(
      req.user.id,
      jobOfferId,
      documentId,
    );
  }

  @Delete(':documentId')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('jobOfferId', ParseUUIDPipe) jobOfferId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    return this.generatedCvsService.removeGeneratedCv(
      req.user.id,
      jobOfferId,
      documentId,
    );
  }
}
